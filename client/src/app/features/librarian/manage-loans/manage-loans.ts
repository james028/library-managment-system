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
import { LoansService } from './loans-service';

@Component({
  selector: 'app-manage-loans',
  standalone: true,
  imports: [CommonModule, AsyncPipe, DataTable],
  templateUrl: './manage-loans.html',
  styleUrl: './manage-loans.scss',
})
export class ManageLoans {
  loansService = inject(LoansService);

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

  private readonly querySubject = new BehaviorSubject<{
    search: string;
    page: number;
    pageSize: number;
  }>({
    search: '',
    page: 1,
    pageSize: 10,
  });
  readonly query$ = this.querySubject.asObservable();

  readonly vm$ = this.query$.pipe(
    switchMap((query) =>
      this.loansService.getUserProfileMock().pipe(
        tap((a) => console.log(a, 'a')),
        map(
          (
            result,
          ): {
            items: LoanMock[];
            total: number;
            query: { search: string; page: number; pageSize: number };
            loading: boolean;
            error: null;
          } => ({
            items: result,
            total: result.length,
            query,
            loading: false,
            error: null,
          }),
        ),
        tap((a) => console.log(a, 'b')),
        catchError(() =>
          of({
            items: [],
            total: 0,
            query,
            loading: false,
            error: 'Nie udało się pobrać danych',
          }),
        ),
        startWith({
          items: [],
          total: 0,
          query,
          loading: true,
          error: null,
        }),
      ),
    ),
  );

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      bookCopyId: ['', Validators.required],
      userId: ['', Validators.required],
    });
  }

  edit(loan: LoanMock) {
    if (this.saving) {
      return;
    }
    this.selectedLoan = loan;
  }
}
