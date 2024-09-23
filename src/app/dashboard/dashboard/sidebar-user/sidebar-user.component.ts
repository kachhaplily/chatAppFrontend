import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../dashboard.service';

@Component({
  selector: 'app-sidebar-user',
  templateUrl: './sidebar-user.component.html',
  styleUrl: './sidebar-user.component.scss',
})
export class SidebarUserComponent implements OnInit {
  constructor(private _service: DashboardService) {}
  ngOnInit(): void {
    this.getUsers();
  }

  /**
   * method to get users
   * @returns
   */
  getUsers(): void {
    this._service.getUserList().subscribe({
      next: (data) => console.log(data),
      error: (error) => console.error(error),
    });
  }
}
