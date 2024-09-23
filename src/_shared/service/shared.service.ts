import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  constructor() {}

  getTokenSubject(token?: string): string | null {
    try {
      if (!token) return null;
      const decodedToken: any = jwtDecode(token);
      return decodedToken.sub || null;
    } catch (error) {
      console.error('Invalid token', error);
      return null;
    }
  }
}
