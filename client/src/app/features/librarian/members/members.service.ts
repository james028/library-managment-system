import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { MEMBERS_MOCK } from './mock/members.mock';
import { PaginatedMember } from './interfaces/members.interface';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

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

  getMembers(): Observable<PaginatedMember> {
    return this.http.get<PaginatedMember>(`${this.baseUrl}`);
  }
}
