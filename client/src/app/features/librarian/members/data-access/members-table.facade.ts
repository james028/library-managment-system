import { Injectable } from '@angular/core';
import { MembersService, PaginatedMembers } from './members.service';
import { Member, MemberEditValue, MembersFiltersFormValue } from '../interfaces/members.interface';
import { BaseTableFacade } from '../../../../shared/table-state/base-table.facade';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class MembersTableFacade extends BaseTableFacade<
  Member,
  MembersFiltersFormValue,
  PaginatedMembers
> {
  constructor(private readonly membersService: MembersService) {
    super(
      {
        search: '',
        status: '',
        createdFrom: '',
        createdTo: '',
        hasActiveLoans: false,
        hasOverdueLoans: false,
        hasUnpaidFines: false,
      },
      (query) => membersService.getMembers(query),
    );
  }

  updateMember(id: number, values: Partial<MemberEditValue>): Observable<Member> {
    return this.membersService.updateMember(id, values).pipe(tap(() => this.refresh()));
  }
}
