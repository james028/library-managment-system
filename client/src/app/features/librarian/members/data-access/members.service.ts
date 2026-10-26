import { Injectable } from '@angular/core';
import { Member, MembersFiltersFormValue } from '../interfaces/members.interface';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { buildHttpParams } from '../../../../shared/http/http-params.utils';
import { PaginatedMember, TableQuery } from '../../../../shared/table-state/table.types';
import { Observable } from 'rxjs';

export interface PaginatedResult<T> {
  items: T[];
  page: number;
  size: number;
  totalItems: number;
  totalPages: number;
}

export type PaginatedMembers = PaginatedResult<Member>;


@Injectable({
  providedIn: 'root',
})
export class MembersService {
  private readonly baseUrl = `${environment.apiUrl}/members`;

  constructor(private http: HttpClient) {}

  getMembers(query: TableQuery<MembersFiltersFormValue>): Observable<PaginatedMembers> {
    console.log(query);
    const params = buildHttpParams({
      page: query.page,
      search: query.filters.search,
      createdFrom: query.filters.createdFrom,
      createdTo: query.filters.createdTo,
      hasActiveLoans: query.filters.hasActiveLoans,
      hasOverdueLoans: query.filters.hasOverdueLoans,
      hasUnpaidFines: query.filters.hasUnpaidFines
      //...query.filters,
    });

    return this.http.get<PaginatedMember>(this.baseUrl, {
      params,
    });
  }
}
