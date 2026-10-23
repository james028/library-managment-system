import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MembersService } from './members.service';
import { Member } from '../interfaces/members.interface';
import { BaseTableFacade } from '../../../../shared/table-state/base-table.facade';
import { PageResult, TableQuery } from '../../../../shared/table-state/table.types';

export interface BooksFilters {
  title: string;
  author: string;
  publishedYear: string;
}

@Injectable()
export class MembersTableFacade extends BaseTableFacade<Member, any> {
   protected readonly initialFilters: any = {
   title: '',
      author: '',
      publishedYear: '',
   };

  //protected readonly pageSize = 10;

  constructor(private readonly membersService: MembersService) {
    super(
      // {
      //   status: '',
      //   createdFrom: '',
      //   createdTo: '',
      //   hasActiveLoans: false,
      //   hasOverdueLoans: false,
      //   hasUnpaidFines: false,
      // },
      // (query) => membersService.getMembers(query),
    );
  }

  //tutaj any zmienic
  protected fetch(
    query: TableQuery<any>,
  ): Observable<any> {
    return this.membersService.getMembers(query);
  }
}
