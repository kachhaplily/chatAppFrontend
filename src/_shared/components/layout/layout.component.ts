import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { DashboardService } from '../../../app/dashboard/dashboard/dashboard.service';
import { userDto, userNavigation } from '../../model/model';
import { AuthService, LogoutOptions } from '@auth0/auth0-angular';
import { environment } from '../../../environmnet/environmnet';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
})
export class LayoutComponent implements OnChanges {
  @Input() showDrawwer: boolean = true;
  @Input() userList!: userNavigation[];
  private logoutRedirectionUrl = environment.redirectUrl;

  ngOnChanges(changes: SimpleChanges): void {
    console.log(this.userList);
  }

  constructor(private auth: AuthService) {}

  logout() {
    localStorage.clear();
    sessionStorage.clear();
    this.auth.logout({
      logoutParams: {
        returnTo: this.logoutRedirectionUrl,
      },
    } as LogoutOptions);
  }
}
