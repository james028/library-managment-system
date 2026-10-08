import { Component, inject, signal } from '@angular/core';
import { Observable, tap, catchError, of, shareReplay } from 'rxjs';
import { LoansService, LoansSummary } from '../../../core/services/LoansService';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule, AsyncPipe } from '@angular/common';


export enum LoanStatsEnum {
  ACTIVE_LOANS = 'activeLoans',
  OVERDUE_LOANS = 'overdueLoans',
  TO_RETURN_TODAY = 'toReturnToday',
  RETURNED_TODAY = 'returnedToday',
}

export type LoanStatsKey = `${LoanStatsEnum}`;

export const LOAN_STATS_LABELS: Record<LoanStatsKey, string> = {
  [LoanStatsEnum.ACTIVE_LOANS]: 'Aktywne wypożyczenia',
  [LoanStatsEnum.OVERDUE_LOANS]: 'Przeterminowane wypożyczenia',
  [LoanStatsEnum.TO_RETURN_TODAY]: 'Do zwrotu dzisiaj',
  [LoanStatsEnum.RETURNED_TODAY]: 'Zwrócone dzisiaj',
};

export function getLoanStatsLabel(key: string): string {
  return LOAN_STATS_LABELS[key as LoanStatsKey] ?? 'Nieznana statystyka';
}

@Component({
  selector: 'app-manage-loans',
  standalone: true,
  imports: [CommonModule, AsyncPipe],
  templateUrl: './manage-loans.html',
  styleUrl: './manage-loans.scss',
})
export class ManageLoans {
  loansService = inject(LoansService);

  readonly isFormOpen = signal(false);

  form: FormGroup;

  readonly loansSummary$ : Observable<LoansSummary> = this.loansService.getSummaryLoans().pipe(
    tap(data => console.log('Pobrane kategorie:', data)),
    catchError(err => {
      console.error('Błąd pobierania profilu', err);
      return of({} as LoansSummary);
    }),
    shareReplay(1)
  );

  getLoanStatsLabel = getLoanStatsLabel;
  statsKeys = Object.values(LoanStatsEnum);

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      bookCopyId: ['', Validators.required],
      userId: ['', Validators.required],
    });
  }
}
