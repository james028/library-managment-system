import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

// Kształt 1:1 z LoanWithDetails z loans.repository.ts (JOIN z books i book_copies)
export interface Loan {
  id: string;
  book_copy_id: string;
  user_id: string;
  borrowed_at: string;
  due_at: string;
  returned_at: string | null;
  extended_count: number;
  book_title: string;
  inventory_number: string;
}

export interface LoansSummary {
  activeLoans: number;
  overdueLoans: number;
  toReturnToday: number;
  returnedToday: number;
}

@Injectable({ providedIn: 'root' })
export class LoansService {
  private readonly baseUrl = `${environment.apiUrl}/loans`;

  constructor(private http: HttpClient) {}

  getMyLoans(): Observable<Loan[]> {
    return this.http.get<Loan[]>(`${this.baseUrl}/me`);
  }

  getSummaryLoans(): Observable<LoansSummary> {
    return this.http.get<LoansSummary>(`${this.baseUrl}/summary`);
  }
}
