import { Injectable } from '@angular/core';
import { delay, Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { SettingsProps } from '../../features/librarian/settings/settings';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  private readonly baseUrl = `${environment.apiUrl}/settings`;

  constructor(private http: HttpClient) {}


  getSettings(): Observable<SettingsProps[]> {
    return this.http.get<SettingsProps[]>(`${this.baseUrl}`);
  }

  updateSettings(values: Record<any, any>): Observable<any> {
    return this.http.patch<any>(`${this.baseUrl}`, values);
  }
}
