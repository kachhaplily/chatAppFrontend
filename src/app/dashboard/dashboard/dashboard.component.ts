import { Component, OnInit } from '@angular/core';
import { DashboardService } from './dashboard.service';

@Component({
  selector: 'app-dashboard',

  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  constructor(private _service: DashboardService) {}

  ngOnInit(): void {
    this.getWatherList();
  }

  getWatherList(): void {
    this._service.getWather().subscribe({
      next: (data) => console.log(data),
      error: (error) => console.error(error),
    });
  }
}
