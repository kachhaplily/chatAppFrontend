import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';

export const dashboardRoute: Routes = [
  {
    path: '',
    redirectTo: 'dashboard/chat-dashboard',
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    children: [
      {
        path: 'chat-dashboard',
        loadChildren: () =>
          import('./dashboard/chat-dashboard/chat-dashboard.module').then(
            (m) => m.ChatDashboardModule
          ),
      },
    ],
  },
];
