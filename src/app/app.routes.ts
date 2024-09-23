import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard/dashboard.component';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
  },
];
