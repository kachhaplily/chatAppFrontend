import { Injectable } from '@angular/core';
import { HttpService } from '../../../_shared/service/http.service';
import { Observable } from 'rxjs';
import { messageDto, userDto } from '../../../_shared/model/model';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  constructor(private httpService: HttpService) {}

  /**
   * method to get wather list
   * @returns
   */
  getWather(): Observable<any> {
    const api = '/WeatherForecast';
    return this.httpService.get(api);
  }

  /**
   *method to get the user information
   * @returns userDto
   */
  getUserList(): Observable<userDto[]> {
    const api = '/userAuth/users';
    return this.httpService.get(api);
  }

  getChatHistory(): Observable<any> {
    const api =
      '/chat/recived?senderId=66e03053246cb45288120255&receiverId=66e00c9a35fee78073287ca9';
    return this.httpService.get(api);
  }

  sendMessage(data: messageDto): Observable<any> {
    const api = '/Chat/send';
    return this.httpService.post(api, data);
  }
}
