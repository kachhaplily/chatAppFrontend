import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SignalrService {
  private hubConnection: signalR.HubConnection;
  private messageSource = new BehaviorSubject<{
    sender: string;
    receiver: string;
    message: string;
    imageBase64?: string;
  } | null>(null);
  private onlineUsersSubject = new BehaviorSubject<string[]>([]); // Subject to emit online users

  public onlineUsers$ = this.onlineUsersSubject.asObservable();

  public message$ = this.messageSource.asObservable();
  private retryInterval = 5000; // 5 seconds

  constructor() {
    // Initialize and configure the SignalR hub connection
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('https://localhost:44316/chatHub', {
        accessTokenFactory: () => this.getAccessToken(),
      })
      .configureLogging(signalR.LogLevel.Information)
      .build();

    this.startConnection();
    this.listenForMessages();

    // Handle connection close events and retry connection
    this.hubConnection.onclose(() => {
      console.error('SignalR connection closed. Attempting to reconnect...');
      this.retryConnection();
    });
  }

  private getAccessToken(): string {
    const token = localStorage.getItem('token');
    return token ? token : '';
  }

  private async startConnection(): Promise<void> {
    try {
      await this.hubConnection.start();
      console.log('SignalR connection established.');
      // Optionally get online users after connection is established
      await this.getOnlineUsers();
    } catch (err) {
      console.error('Error while establishing SignalR connection:', err);
      this.retryConnection();
    }
  }

  private retryConnection(): void {
    setTimeout(() => {
      this.startConnection();
    }, this.retryInterval);
  }

  private listenForMessages(): void {
    this.hubConnection.on(
      'ReceiveMessage',
      (chatMessage: {
        senderUserId: string;
        receiverUserId: string;
        messageText: string;
        imageBase64?: string;
        sentAt: string;
      }) => {
        const { senderUserId, receiverUserId, messageText, imageBase64 } =
          chatMessage;
        this.messageSource.next({
          sender: senderUserId,
          receiver: receiverUserId,
          message: messageText,
          imageBase64: imageBase64,
        });
      }
    );
  }

  public sendPrivateMessage(
    connectionId: string,
    message: string,
    fileUrl: string | null
  ): void {
    console.log(connectionId, fileUrl);
    this.hubConnection
      .invoke('SendPrivateMessage', connectionId, message, fileUrl)
      .catch((err) =>
        console.error('Error while sending private message:', err)
      );
  }

  /**
   *
   * @returns
   */
  public async getOnlineUsers(): Promise<string[]> {
    try {
      if (this.hubConnection.state === signalR.HubConnectionState.Connected) {
        const onlineUsers = await this.hubConnection.invoke<string[]>(
          'GetOnlineUsers'
        );
        this.onlineUsersSubject.next(onlineUsers);
        return onlineUsers;
      } else {
        console.error(
          'SignalR connection is not established. Current state:',
          this.hubConnection.state
        );
        return [];
      }
    } catch (err) {
      console.error('Error while retrieving online users:', err);
      return [];
    }
  }
  // Add this method to check the connection state
  public isConnected(): boolean {
    return this.hubConnection.state === signalR.HubConnectionState.Connected;
  }
}
