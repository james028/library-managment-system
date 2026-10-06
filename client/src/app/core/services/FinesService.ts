import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

// Kształt 1:1 z FineWithDetails z fines.repository.ts.
// UWAGA: amount to string (NUMERIC z Postgresa) — patrz komentarz w backendowym README fines.
export interface Fine {
  id: string;
  loan_id: string;
  amount: string;
  paid: boolean;
  created_at: string;
  title: string;
  user_id: string;
  published_year: string;
}

@Injectable({ providedIn: 'root' })
export class FinesService {
  private readonly baseUrl = `${environment.apiUrl}/fines`;

  constructor(private http: HttpClient) {}

  getMyFines(): Observable<Fine[]> {
    return this.http.get<Fine[]>(`${this.baseUrl}/me`);
  }
}
