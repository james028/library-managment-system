import { Component, inject } from '@angular/core';
import { catchError, Observable, of, shareReplay } from 'rxjs';
import { tap } from 'rxjs/operators';
import { FormBuilder, Validators } from '@angular/forms';
import { AsyncPipe, CommonModule } from '@angular/common';
import { DataTable } from '../../../shared/ui/data-table/data-table';
import { LOAN_COLUMNS } from './loan-columns';
import { getLoanStatsLabel } from './loan-stats.constants';
import { LoanMock, LoansSummary, LoanStatsEnum } from './models/loan-model';
import { LoansService } from './data-access/loans.service';
import { LoansTableFacade } from './data-access/members-table.facade';
import { TableFilters } from '../../../shared/ui/table-filters/table-filters';
import { loansFilterConfig } from './manage-loans-filter-config';

@Component({
  selector: 'app-manage-loans',
  standalone: true,
  providers: [LoansTableFacade],
  imports: [CommonModule, AsyncPipe, DataTable, TableFilters],
  templateUrl: './manage-loans.html',
  styleUrl: './manage-loans.scss',
})
export class ManageLoans {
  loansService = inject(LoansService);
  readonly loansTableFacade = inject(LoansTableFacade);

  //readonly isFormOpen = signal(false);
  form: any;
  selectedLoan: LoanMock | null = null;
  saving: boolean = false;

  loansColumns = LOAN_COLUMNS;
  getLoanStatsLabel = getLoanStatsLabel;
  statsKeys = Object.values(LoanStatsEnum);

  readonly loansFilterConfig = loansFilterConfig;

  readonly loansSummary$: Observable<LoansSummary> = this.loansService.getSummaryLoans().pipe(
    tap((data) => console.log('Pobrane kategorie:', data)),
    catchError((err) => {
      console.error('Błąd pobierania profilu', err);
      return of({} as LoansSummary);
    }),
    shareReplay(1),
  );

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      bookCopyId: ['', Validators.required],
      userId: ['', Validators.required],
    });
  }

  onApplySubmit(value: any): void {
    this.loansTableFacade.applySubmit(value);
  }

  onResetFilters() {
    this.loansTableFacade.resetFilters();
  }

  edit(loan: any) {
    if (this.saving) {
      return;
    }
    this.selectedLoan = loan;
  }
}
