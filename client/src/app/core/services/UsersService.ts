import { Injectable } from '@angular/core';
import { delay, Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  isActive: boolean;
  createdAt: Date;
}

export const MOCK_USER = {
  id: 'usr-99887766',
  email: 'jan.kowalski@example.com',
  firstName: 'Jan',
  lastName: 'Kowalski',
  role: 'admin',
  isActive: true,
  createdAt: new Date('2024-03-15T10:30:00Z'),
};

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private readonly baseUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {}

  // Zamiast this.http.get(...) zwracamy mocka z opóźnieniem (symulacja sieci)
  getUserProfileMock(): Observable<UserProfile> {
    return of(MOCK_USER).pipe(
      delay(400), // opóźnienie 400ms, żeby zobaczyć np. loader, jeśli go masz
    );
  }

  getUserProfile(): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.baseUrl}/me`);
  }
}
