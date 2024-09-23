import { Component, OnInit } from '@angular/core';
import { DashboardService } from './dashboard.service';
import { AuthService, LogoutOptions } from '@auth0/auth0-angular';
import { environment } from '../../../environmnet/environmnet';
import { userDto, userNavigation } from '../../../_shared/model/model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  private logoutRedirectionUrl = environment.redirectUrl;
  userList!: userNavigation[];
  constructor(private _service: DashboardService, private auth: AuthService) {}

  ngOnInit(): void {
    this.getUserChatHistory();
    this.getUsers();
  }

  getUserChatHistory(): void {
    this._service.getChatHistory().subscribe({
      next: (data) => console.log(data),
      error: (error) => console.error(error),
    });
  }

  logout() {
    localStorage.clear();
    sessionStorage.clear();
    this.auth.logout({
      logoutParams: {
        returnTo: this.logoutRedirectionUrl,
      },
    } as LogoutOptions);
  }

  /**
   * method to get the user details
   * @returns
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
      },
      error: (error) => console.error(error),
    });
  }
}
