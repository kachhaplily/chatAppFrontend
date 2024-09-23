import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatDashboardComponent } from './chat-dashboard.component';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../../../_shared/module/shared.module';
import { CommonThemeModule } from '../../../../_shared/module/common-theme.module';
import { chatRoute } from './route';
import { ChatComponent } from './chat/chat.component';

@NgModule({
  declarations: [ChatDashboardComponent, ChatComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(chatRoute),
    FormsModule,
    SharedModule,
    CommonThemeModule,
  ],
})
export class ChatDashboardModule {}
