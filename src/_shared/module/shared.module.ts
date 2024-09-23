import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from '../components/layout/layout.component';
import { CommonThemeModule } from './common-theme.module';
import { ChatFormComponent } from '../components/chat-form/chat-form.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [LayoutComponent, ChatFormComponent],
  imports: [CommonModule, CommonThemeModule, RouterModule],
  exports: [LayoutComponent], // this makes the SidebarComponent available for other modules
})
export class SharedModule {}
