import { Component, inject } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  map,
  Observable,
  of,
  shareReplay,
  startWith,
  switchMap,
} from 'rxjs';
import { tap } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AsyncPipe, CommonModule } from '@angular/common';
import { DataTable } from '../../../shared/ui/data-table/data-table';
import { LOAN_COLUMNS } from './loan-columns';
import { getLoanStatsLabel } from './loan-stats.constants';
import { LoansSummary, LoanStatsEnum, LoanMock } from './models/loan-model';
import { LoansService } from './data-access/loans.service';
import { LoansTableFacade } from './data-access/members-table.facade';

@Component({
  selector: 'app-manage-loans',
  standalone: true,
  providers: [LoansTableFacade],
  imports: [CommonModule, AsyncPipe, DataTable],
  templateUrl: './manage-loans.html',
  styleUrl: './manage-loans.scss',
})
export class ManageLoans {
  loansService = inject(LoansService);
  readonly loansTableFacade = inject(LoansTableFacade);

  //readonly isFormOpen = signal(false);
  form: FormGroup;
  selectedLoan: LoanMock | null = null;
  saving: boolean = false;

  loansColumns = LOAN_COLUMNS;
  getLoanStatsLabel = getLoanStatsLabel;
  statsKeys = Object.values(LoanStatsEnum);

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

    this.loansTableFacade.vm$.subscribe((loan) => {
      console.log(loan.items[0]?.loan, "eeeee");
    })
  }

  edit(loan: any) {
    if (this.saving) {
      return;
    }
    this.selectedLoan = loan;
  }
}
