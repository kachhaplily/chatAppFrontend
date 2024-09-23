import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RouterModule } from '@angular/router';
import { dashboardRoute } from './dashboard.route';
import { SidebarUserComponent } from './dashboard/sidebar-user/sidebar-user.component';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../_shared/module/shared.module';
import { CommonThemeModule } from '../../_shared/module/common-theme.module';

@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(dashboardRoute),
    FormsModule,
    SharedModule,
    CommonThemeModule,
  ],
})
export class DashboardModule {}
