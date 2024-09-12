import { Injectable } from '@angular/core';
import { environment } from '../../environmnet/environmnet';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  private API_URL = environment.API_URL;
  private headers: HttpHeaders;
  basePath = `${this.API_URL}`;

  constructor(private readonly http: HttpClient) {
    this.headers = new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8',
    });
  }

  private getToken(): string | null {
    return localStorage.getItem('token');
  }

  /**
   * Method to get data
   * @param apiName get api endpoint as param
   * @param headers optional headers to include in the request
   * @param responseType optional response type to specify
   * @returns return data as Observable<T>
   */
  get<T>(
    apiName: string,
    headers?: HttpHeaders,
    responseType?: string
  ): Observable<T> {
    const token = this.getToken();

    let updatedHeaders = headers ? headers : this.headers;

    if (token) {
      updatedHeaders = updatedHeaders.set('Authorization', `Bearer ${token}`);
    }

    return this.http.get<T>(`${this.basePath}${apiName}`, {
      headers: updatedHeaders,
      responseType: responseType as 'json',
      withCredentials: true,
    }) as Observable<T>;
  }

  /**
   * Generic method for making a POST API call
   * @param apiName The URL of the API endpoint
   * @param data The data to be sent in the request body
   * @param isHeaderDisable Optional flag to disable custom headers
   * @returns An Observable of the API response
   */
  post<T>(
    apiName: string,
    data?: object | string | number,
    isHeaderDisable?: boolean,
    headers?: HttpHeaders,
    responseType?: string
  ): Observable<T> {
    let upheaders = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');

    const token = this.getToken();

    if (token) {
      headers = upheaders.set('Authorization', `Bearer ${token}`);
    }

    // If headers are disabled, overwrite headers with default ones
    if (isHeaderDisable) {
      headers = new HttpHeaders({
        'Content-Type': 'application/json',
        Accept: 'application/json',
      });
    }

    return this.http.post<T>(`${this.basePath}${apiName}`, data, {
      headers,
      withCredentials: true,
      responseType: responseType as 'json',
    });
  }

  /**
   * Method to delete data
   * @param apiName get apiend point as param
   * @returns return data
   */
  delete<T>(apiName: string): Observable<T> {
    const token = this.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete<T>(`${this.basePath}${apiName}`, {
      headers,
      withCredentials: true,
    });
  }

  /**
   * Generic method for making a PUT API call
   * @param apiUrl The URL of the API endpoint
   * @param data The data to be sent in the request body
   * @returns An Observable of the API response
   */
  putApi<T>(apiName: string, data?: object | string | number): Observable<T> {
    const token = this.getToken();
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`);

    return this.http.put<T>(`${this.basePath}${apiName}`, data, {
      headers,
      withCredentials: true,
    });
  }

  /**
   * Generic method for making a P API call
   * @param apiUrl The URL of the API endpoint
   * @param data The data to be sent in the request body
   * @returns An Observable of the API response
   */
  patch<T>(apiName: string, data?: object | string | number): Observable<T> {
    const token = this.getToken();
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`);

    return this.http.patch<T>(`${this.basePath}${apiName}`, data, {
      headers,
      withCredentials: true,
    });
  }

  /**
   * Generic method for making a post api call have form body with header
   * @param url The URL of the API endpoint
   * @param formData  formData
   * @param [headers=new HttpHeaders()] =header of postApi
   *
   */
  postFormData<T>(url: string, formData: FormData): Observable<T> {
    const token = this.getToken();
    const headers = new HttpHeaders()
      .set('accept', '*/*')
      .set('Authorization', `Bearer ${token}`);
    return this.http.post<T>(`${this.basePath}${url}`, formData, {
      headers,
      withCredentials: true,
    });
  }

  updateFormData<T>(url: string, formData: FormData): Observable<T> {
    const token = this.getToken();
    const headers = new HttpHeaders()
      .set('accept', '*/*')
      .set('Authorization', `Bearer ${token}`);
    return this.http.put<T>(`${this.basePath}${url}`, formData, {
      headers,
      withCredentials: true,
    });
  }
}
