import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { delay, Observable, of } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { Loan, LoansSummary, LoanListResponse, LoanQueryParams, LoanView, LoanListItem } from '../models/loan-model';
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

  getLoans(query: LoanQueryParams): Observable<PaginatedLoans> {

    console.log(query, "get loans");
    const params = buildHttpParams({
      page: query.page,
      //...query.filters,
    });

    return this.http.get<PaginatedLoans>(this.baseUrl, { params });
  }
}
