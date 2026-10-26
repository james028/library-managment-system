import { Injectable } from '@angular/core';
import { MembersService, PaginatedMembers } from './members.service';
import { Member, MembersFiltersFormValue } from '../interfaces/members.interface';
import { BaseTableFacade } from '../../../../shared/table-state/base-table.facade';

export interface BooksFilters {
  title: string;
  author: string;
  publishedYear: string;
}

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
}
