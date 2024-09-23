import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { Observable } from 'rxjs';
import { chatHistoryDto } from '../model/model';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  constructor(private httpService: HttpService) {}

  /**
   * Retrieves the chat history between two users.
   *
   * This method sends a GET request to the API to fetch the chat history for the specified sender and receiver.
   * The response will be an observable that emits the chat history data.
   *
   * @param senderId - The ID of the sender user.
   * @param receiverId - The ID of the receiver user.
   * @returns An `Observable` that emits the chat history data chatHistoryDto.
   */
  getChatHistory(
    senderId?: string,
    receiverId?: string
  ): Observable<chatHistoryDto[]> {
    const apiName = `/Chat/chat_history?senderId=${senderId}&receiverId=${receiverId}`;
    return this.httpService.get(apiName);
  }
}
