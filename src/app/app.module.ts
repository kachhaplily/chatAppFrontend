import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { routes } from './app.routes';
import { AuthModule } from '@auth0/auth0-angular';
import { environment } from '../environmnet/environmnet';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

@NgModule({
  declarations: [AppComponent],
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes),

    AuthModule.forRoot({ ...environment.auth }),
  ],
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
    provideAnimations(),
    provideAnimationsAsync(),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
