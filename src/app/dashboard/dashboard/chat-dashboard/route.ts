import { Routes } from '@angular/router';
import { ChatDashboardComponent } from './chat-dashboard.component';
import { ChatComponent } from './chat/chat.component';

export const chatRoute: Routes = [
  {
    path: '',
    component: ChatDashboardComponent,
    children: [
      {
        path: ':path',
        component: ChatComponent,
      },
    ],
  },
];
