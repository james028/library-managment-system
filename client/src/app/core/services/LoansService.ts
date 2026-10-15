import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { delay, Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Book } from '../book/book.service';
import { LoanStatus, LoanTag } from '../../features/librarian/manage-loans/manage-loans';

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

export interface PaginatedLoans {
  items: Book[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface Query {
  page?: number;
  limit?: number;
  search?: string;
}

export interface LoanMock {
  id: number;
  bookTitle: string;
  borrowerName: string;
  borrowedAt: string; // ISO date, np. '2026-10-01'
  dueAt: string;
  amountDue: number;
  status: LoanStatus;
  tags: LoanTag[];
}

const loans: LoanMock[] = [
  {
    id: 1,
    bookTitle: 'Czysty kod',
    borrowerName: 'Anna Kowalska',
    borrowedAt: '2026-09-28',
    dueAt: '2026-10-12',
    amountDue: 0,
    status: 'ACTIVE',
    tags: [{ label: 'Popularna', type: 'success' }],
  },
  {
    id: 2,
    bookTitle: 'Design Patterns',
    borrowerName: 'Piotr Nowak',
    borrowedAt: '2026-08-30',
    dueAt: '2026-09-13',
    amountDue: 12.5,
    status: 'OVERDUE',
    tags: [
      { label: 'Po terminie', type: 'danger' },
      { label: 'Kara', type: 'warning' },
    ],
  },
  {
    id: 3,
    bookTitle: 'Clean Architecture',
    borrowerName: 'Maria Wiśniewska',
    borrowedAt: '2026-09-01',
    dueAt: '2026-09-15',
    amountDue: 0,
    status: 'RETURNED',
    tags: [{ label: 'Zwrócona', type: 'success' }],
  },
];

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

  getLoans(query: Query): Observable<PaginatedLoans> {
    let params = new HttpParams();

    //zmienić na funcje pod dynamiczne wartośći
    if (query.page) params = params.set('page', query.page);
    if (query.limit) params = params.set('limit', query.limit);
    if (query.search) params = params.set('search', query.search);

    return this.http.get<PaginatedLoans>(this.baseUrl, { params });
  }

  getUserProfileMock(): Observable<LoanMock[]> {
    return of(loans).pipe(
      delay(400)
    );
  }
}
