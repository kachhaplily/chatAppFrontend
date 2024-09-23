import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { chatHistoryDto, messageDto } from '../../../../../_shared/model/model';
import { SignalrService } from '../../../../../_shared/service/signal-r.service';
import { DashboardService } from '../../dashboard.service';
import { SharedService } from '../../../../../_shared/service/shared.service';
import { ChatService } from '../../../../../_shared/service/chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit {
  messages!: chatHistoryDto[];
  public messageText: string = '';
  reciverId: string = '';
  authId?: string;
  senderId?: string;

  requestMessgage: messageDto;

  constructor(
    private signalRService: SignalrService,
    private route: ActivatedRoute,
    private router: Router,
    private sharedService: SharedService,
    private chatService: ChatService
  ) {
    // Initialize message DTO with empty values
    this.requestMessgage = {
      ReceiverUserId: this.reciverId,
      MessageText: '',
    };
  }

  ngOnInit(): void {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.getRouteStateData();
      });

    this.getMessage();
  }

  private getRouteStateData(): void {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      const state = navigation.extras.state as { authId: string }; // Adjust the type accordingly
      this.authId = state.authId; // Access the authId
      this.getChatHistory(); // Fetch chat history or perform other actions
    } else {
      console.warn('No state available for authId.');
    }
  }

  /**
   *method to get the current chat
   */
  private getMessage(): void {
    const token = localStorage.getItem('token')?.toString();
    this.senderId = this.sharedService.getTokenSubject(token) ?? undefined;

    this.signalRService.message$.subscribe((msg) => {
      if (msg?.sender == this.senderId) {
        let chatObj: chatHistoryDto = {
          senderUserId: msg?.sender || '',
          receiverUserId: '',
          messageText: msg?.message || '',
          sentAt: new Date().toISOString(),
        };
        this.messages.push(chatObj);

        // Message sent by the user
      } else {
        let chatObj: chatHistoryDto = {
          senderUserId: '',
          receiverUserId: msg?.sender || '',
          messageText: msg?.message || '',
          sentAt: new Date().toISOString(),
        };
        this.messages.push(chatObj);
      }
    });
  }

  /**
   * method to send a message to chatservice
   *
   * @returns
   */

  public sendMessage(): void {
    if (!this.authId) {
      return;
    }
    this.requestMessgage = {
      ReceiverUserId: this.authId,
      MessageText: this.messageText,
    };
    this.signalRService.sendPrivateMessage(this.authId, this.messageText);
    this.messageText = '';
  }

  /**
   * method to get chat history
   */
  getChatHistory(): void {
    this.chatService
      .getChatHistory(this.senderId, this.authId)
      .subscribe((data) => {
        this.messages = data;
      });
  }
}
