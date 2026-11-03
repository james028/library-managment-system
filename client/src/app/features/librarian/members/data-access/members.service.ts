import { Injectable } from '@angular/core';
import {
  Member,
  MemberEditValue,
  MemberImportResult,
  MembersFiltersFormValue,
  PaginatedMembers,
} from '../interfaces/members.interface';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { buildHttpParams } from '../../../../shared/http/http-params.utils';
import { PaginatedMember, TableQuery } from '../../../../shared/table-state/table.types';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MembersService {
  private readonly baseUrl = `${environment.apiUrl}/members`;

  constructor(private http: HttpClient) {}

  getMembers(query: TableQuery<MembersFiltersFormValue>): Observable<PaginatedMembers> {
    const params = buildHttpParams({
      page: query.page,
      search: query.filters.search,
      createdFrom: query.filters.createdFrom,
      createdTo: query.filters.createdTo,
      hasActiveLoans: query.filters.hasActiveLoans,
      hasOverdueLoans: query.filters.hasOverdueLoans,
      hasUnpaidFines: query.filters.hasUnpaidFines,
      //...query.filters,
    });

    return this.http.get<PaginatedMember>(this.baseUrl, {
      params,
    });
  }

  updateMember(id: number, value: Partial<MemberEditValue>): Observable<Member> {
    return this.http.patch<Member>(`${this.baseUrl}/${id}`, value);
  }

  importFromCsv(file: File) {
    const formData = new FormData();
    formData.append('file', file);

    console.log(formData, "formData");

    return this.http.post<MemberImportResult>(
      `${this.baseUrl}/import`,
      formData,
    );
  }
}
