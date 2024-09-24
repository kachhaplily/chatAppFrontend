import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { chatHistoryDto, messageDto } from '../../../../../_shared/model/model';
import { SignalrService } from '../../../../../_shared/service/signal-r.service';
import { DashboardService } from '../../dashboard.service';
import { SharedService } from '../../../../../_shared/service/shared.service';
import { ChatService } from '../../../../../_shared/service/chat.service';
import { DomSanitizer } from '@angular/platform-browser';

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
  selectedFile: string | null = null;
  fileLocalPath?: string;
  requestMessgage: messageDto;

  constructor(
    private signalRService: SignalrService,
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
          imageBase64: msg?.imageBase64,
          sentAt: new Date().toISOString(),
        };
        this.messages.push(chatObj);

        // Message sent by the user
      } else {
        let chatObj: chatHistoryDto = {
          senderUserId: '',
          receiverUserId: msg?.sender || '',
          messageText: msg?.message || '',
          imageBase64: msg?.imageBase64,
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

    this.signalRService.sendPrivateMessage(
      this.authId,
      this.messageText,
      this.selectedFile
    );
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

  /**
   *method to open the file
   */
  browseFile() {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    fileInput.click();
  }

  onFileSelect(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      const file = fileInput.files[0];
      this.fileLocalPath = file.name;

      // Create FormData object and append the file
      const formData = new FormData();
      formData.append('file', file); // Ensure the key matches the API expectation

      // Call the uploadFile method with FormData
      this.chatService.uploadFile(formData).subscribe({
        next: (response) => {
          this.selectedFile = response.filePath;
        },
        error: (error) => {
          console.error('Error uploading file:', error);
        },
      });
    }
  }

  // Helper function to check if the file is a document (PDF, DOCX, XLSX, etc.)
  isDocumentFile(fileBase64: string | null | undefined): boolean {
    if (!fileBase64) return false;

    // Regular expression to check file extension in the Base64 URL or file name
    const fileExtensions = /\.(pdf|docx?|xlsx?|pptx?)$/i;

    // If the fileBase64 is a URL, you can extract the extension and test it
    return fileExtensions.test(fileBase64);
  }

  // Helper function to check if the file is an image
  isImageFile(fileBase64: string | null | undefined): boolean {
    if (!fileBase64) return false;

    // Regular expression to match common image file extensions
    const imageExtensions = /\.(jpg|jpeg|png|gif|bmp|svg)$/i;

    // Test if the fileBase64 or URL ends with any of the specified image extensions
    return imageExtensions.test(fileBase64);
  }

  // Helper function to get file name (can be improved if fileBase64 contains full URL)
  getFileName(fileBase64: string | null | undefined): string {
    if (!fileBase64) return 'Unknown File';

    // Optionally, extract file name from fileBase64 URL (if present)
    const fileNameMatch = fileBase64.match(
      /[^/\\&\?]+\.\w{3,4}(?=([\?&].*$|$))/
    );
    return fileNameMatch ? fileNameMatch[0] : 'Document';
  }
}
