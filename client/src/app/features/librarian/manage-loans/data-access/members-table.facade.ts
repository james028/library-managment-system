import { Injectable } from '@angular/core';
import { BaseTableFacade } from '../../../../shared/table-state/base-table.facade';
import { LoansService, PaginatedLoans, PaginatedResult } from './loans.service';
import { Loan, LoanFilters, LoanListItem } from '../models/loan-model';

@Injectable()
export class LoansTableFacade extends BaseTableFacade<
  LoanListItem,
  LoanFilters,
  PaginatedLoans
> {
  constructor(private readonly loansService: LoansService) {
    super(
      {
        search: '',
        status: '',
        memberId: '',
        bookId: '',
        bookCopyId: '',
        borrowedFrom: '',
        borrowedTo: '',
        dueFrom: '',
        dueTo: '',
        returnedFrom: '',
        returnedTo: '',
        active: false,
        overdue: false,
      },
      (query) => this.loansService.getLoans(query),
    );
  }
}
