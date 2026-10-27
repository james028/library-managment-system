import { Injectable } from '@angular/core';
import { BaseTableFacade } from '../../../../shared/table-state/base-table.facade';
import { LoansService, PaginatedLoans } from './loans.service';
import { Loan, LoansFilters } from '../models/loan-model';

@Injectable()
export class LoansTableFacade extends BaseTableFacade<
  Loan,
  LoansFilters,
  PaginatedLoans
> {
  constructor(private readonly loansService: LoansService) {
    super(
      {
        search: '',
        status: '',
        createdFrom: '',
        createdTo: '',
      },
      () => this.loansService.getUserProfileMock(),
    );
  }
}
