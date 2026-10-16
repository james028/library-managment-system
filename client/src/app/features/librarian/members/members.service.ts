import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';
import { MEMBERS_MOCK } from './mock/members.mock';
import { MemberMock } from './interfaces/members.interface';


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
  getMembers(): Observable<MemberMock[]> {
    return of(MEMBERS_MOCK);
  }
}
