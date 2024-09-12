import { Injectable } from '@angular/core';
import { HttpService } from '../../../_shared/service/http.service';
import { Observable } from 'rxjs';

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
}
