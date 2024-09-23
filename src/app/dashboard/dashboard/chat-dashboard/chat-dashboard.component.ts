import { Component, Input, OnInit } from '@angular/core';
import { userDto, userNavigation } from '../../../../_shared/model/model';
import { DashboardService } from '../dashboard.service';
import { SignalrService } from '../../../../_shared/service/signal-r.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-chat-dashboard',
  templateUrl: './chat-dashboard.component.html',
  styleUrl: './chat-dashboard.component.scss',
})
export class ChatDashboardComponent implements OnInit {
  userList!: userNavigation[];
  onlineUsers: string[] = []; // Array to store online users
  private onlineUsersSubscription!: Subscription;

  constructor(
    private _service: DashboardService,
    private signalRService: SignalrService
  ) {}

  ngOnInit(): void {
    this.getUsers();
  }

  /**
   *
   */
  getUsers() {
    this._service.getUserList().subscribe({
      next: (data: userDto[]) => {
        this.userList = data.map((user) => ({
          firstName: user.firstName,
          email: user.email,
          path: `${user.email}`,
          icon: 'person',
          authId: `auth0|${user.authId}`,
        }));
        this.getUserOnline();
      },
      error: (error) => console.error(error),
    });
  }

  /**
   *method to get online user information
   */
  public async getUserOnline() {
    this.onlineUsersSubscription = this.signalRService.onlineUsers$.subscribe(
      (users) => {
        this.onlineUsers = users;
        this.userList.forEach((user) => {
          if (user.authId) {
            user.isActive = this.onlineUsers.includes(user.authId);
          } else {
            user.isActive = false;
          }
        });
      }
    );
  }
}
