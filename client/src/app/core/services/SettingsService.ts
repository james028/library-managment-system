import { Injectable } from '@angular/core';
import { delay, Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

export interface Settings {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  isActive: boolean;
  createdAt: Date;
}

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  private readonly baseUrl = `${environment.apiUrl}/settings`;

  constructor(private http: HttpClient) {}


  getSettings(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}`);
  }

  updateSettings(values: Record<any, any>): Observable<any> {
    return this.http.patch<any>(`${this.baseUrl}`, values);
  }
}
