import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'test demo';
  isLoading: boolean;

  constructor(private router: Router, private auth: AuthService) {
    this.isLoading = true;
  }

  ngOnInit(): void {
    this.authenticateRoute();
  }

  /**
   * Method to authenticate user for Auth0
   * Check if user is logged in or not
   */
  private authenticateRoute(): void {
    this.auth.isAuthenticated$.subscribe({
      next: (isAuthenticated) => {
        if (!isAuthenticated) {
          // If the user is not authenticated, redirect them to the Auth0 login page
          this.auth.loginWithRedirect();
        } else {
          // If the user is authenticated, check the token and navigate to the desired route
          this.auth.idTokenClaims$.subscribe({
            next: (res) => {
              if (res && res.__raw) {
                this.auth.getAccessTokenSilently().subscribe({
                  next: (response) => {
                    localStorage.setItem('token', response);
                    this.router.navigate(['']);
                    this.isLoading = false;
                  },
                  error: () => {
                    this.auth.loginWithRedirect();
                    this.isLoading = false;
                  },
                });
              } else {
                this.auth.loginWithRedirect();
              }
            },
            error: () => {
              this.isLoading = false;
              this.auth.loginWithRedirect();
            },
          });
        }
      },
      error: () => {
        this.isLoading = false;
        this.auth.loginWithRedirect();
      },
    });
  }

  /**
   * Method to check token is available or not
   * @returns returns true/false
   */
  hasValidToken(): boolean {
    const token = localStorage.getItem('token');
    return !!token;
  }

  /**
   * Method to get access token from auth0
   */
  getToken(): void {
    this.auth.getAccessTokenSilently().subscribe(
      (token: string) => {
        localStorage.setItem('token', token);
        this.router.navigate(['"']);
      },
      (error) => {
        console.error('Error retrieving access token:', error);
      }
    );
  }
}
