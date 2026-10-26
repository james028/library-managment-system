import { Injectable } from '@angular/core';
import { MEMBERS_MOCK } from '../mock/members.mock';
import { PaginatedMember } from '../interfaces/members.interface';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { buildHttpParams } from '../../../../shared/http/http-params.utils';
import { TableQuery } from '../../../../shared/table-state/table.types';
import { Observable } from 'rxjs';

export const PAGINATED_MEMBERS_MOCK: any = {
  items: MEMBERS_MOCK,
  page: 1,
  size: 20,
  totalItems: MEMBERS_MOCK.length,
  totalPages: 1,
};

@Injectable({
  providedIn: 'root',
})
export class MembersService {
  private readonly baseUrl = `${environment.apiUrl}/members`;

  constructor(private http: HttpClient) {}

  getMembers(
    query: TableQuery<any>,
  ): Observable<any> {
    const params = buildHttpParams({
      page: query.page,
      ...query.filters,
    });

    return this.http.get<PaginatedMember>(this.baseUrl, {
      params,
    });
  }
}
