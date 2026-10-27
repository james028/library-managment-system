import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { delay, Observable, of } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { Loan, LoanMock, LoansSummary, LoanQuery } from '../models/loan-model';
import { Member, MembersFiltersFormValue } from '../../members/interfaces/members.interface';
import { TableQuery } from '../../../../shared/table-state/table.types';


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

export interface PaginatedResult<T> {
  items: T[];
  page: number;
  size: number;
  totalItems: number;
  totalPages: number;
}

export type PaginatedLoans = PaginatedResult<Loan>;

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

  getLoans(query: any): Observable<PaginatedLoans> {
    let params = new HttpParams();

    //zmienić na funcje pod dynamiczne wartośći
    if (query.page) params = params.set('page', query.page);
    if (query.limit) params = params.set('limit', query.limit);
    if (query.search) params = params.set('search', query.search);

    return this.http.get<PaginatedLoans>(this.baseUrl, { params });
  }

  getUserProfileMock(): Observable<PaginatedLoans> {
    const c = of(loans).pipe(delay(400));


    return {
      // @ts-ignore
      items: loans,
      page: 1,
      size: 3,
      totalItems: null,
      totalPages: null,
    }
  }
}
