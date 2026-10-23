import { Injectable } from '@angular/core';
import { MEMBERS_MOCK } from '../mock/members.mock';
import { PaginatedMember } from '../interfaces/members.interface';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';

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

  //tutaj any
  //Observable<HttpEvent<PaginatedMember>>
  getMembers(query: any): any {
    let params = new HttpParams();

    if (query.page) params = params.set('page', query.page);
    if (query.fitlers?.createdFrom) params = params.set('createdFrom', query.filters?.createdFrom);
    if (query.filters?.createdTo) params = params.set('createdTo', query.filters?.createdTo);

    console.log({ params });

    return this.http.get<PaginatedMember>(`${this.baseUrl}`, { params });
  }

  private appendParam(params: HttpParams, key: string, value: unknown): HttpParams {
    if (value === null || value === undefined) {
      return params;
    }

    const normalized = typeof value === 'string' ? value.trim() : String(value);

    if (normalized === '') {
      return params;
    }

    return params.set(key, normalized);
  }
}
