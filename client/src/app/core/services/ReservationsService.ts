import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export type ReservationStatus = 'pending' | 'ready' | 'fulfilled' | 'cancelled';

export interface Reservation {
  id: string;
  book__id: string;
  user_id: string;
  reserved_at: string;
  expires_at: string;
  status: ReservationStatus;
  book_title: string;
}
//
// CREATE TYPE reservation_status AS ENUM ('pending', 'fulfilled', 'cancelled', 'expired');
//
// "id": "08c9a439-fad2-4d41-8bbf-7d2fd5bc1af5",
//   "book_id": "e1b32888-216a-4a2b-ae84-0d6aeb93507c",
//   "user_id": "1b5c7860-de7a-47fa-a01d-05df92862e69",
//   "reserved_at": "2026-09-29T09:24:58.156Z",
//   "expires_at": "2026-10-02T11:24:58.348Z",
//   "status": "cancelled",
//   "book_title": "Building Microservices"

@Injectable({ providedIn: 'root' })
export class ReservationsService {
  private readonly baseUrl = `${environment.apiUrl}/reservations`;

  constructor(private http: HttpClient) {}

  getMyReservations(): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(`${this.baseUrl}/me`);
  }

  cancelMyReservations(id: string): Observable<any> {
    return this.http.patch(`${this.baseUrl}/${id}/cancel`, {});
  }
}
