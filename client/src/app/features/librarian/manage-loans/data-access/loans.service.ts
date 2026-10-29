import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { LoanFilters, LoanListItem, LoansSummary, LoanView } from '../models/loan-model';
import { buildHttpParams } from '../../../../shared/http/http-params.utils';

export interface PaginatedResult<T> {
  items: T[];
  page: number;
  size: number;
  totalItems: number;
  totalPages: number;
}

export type PaginatedLoans = PaginatedResult<LoanListItem>;

@Injectable({ providedIn: 'root' })
export class LoansService {
  private readonly baseUrl = `${environment.apiUrl}/loans`;

  constructor(private http: HttpClient) {}

  getMyLoans(): Observable<LoanView[]> {
    return this.http.get<LoanView[]>(`${this.baseUrl}/me`);
  }

  getSummaryLoans(): Observable<LoansSummary> {
    return this.http.get<LoansSummary>(`${this.baseUrl}/summary`);
  }

  getLoans(query: { page: number; filters: LoanFilters }): Observable<PaginatedLoans> {
    const { status, ...restFilters } = query.filters;
    const params = buildHttpParams({
      page: query.page,
      ...restFilters
    });

    return this.http.get<PaginatedLoans>(this.baseUrl, { params });
  }
}
