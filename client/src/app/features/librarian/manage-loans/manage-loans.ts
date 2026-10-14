import { Component, inject, signal } from '@angular/core';
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
import { Loan, LoansService, LoansSummary } from '../../../core/services/LoansService';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AsyncPipe, CommonModule } from '@angular/common';
import { ColumnDef, DataTable, ListQuery, TableColumn } from '../../../shared/ui/data-table/data-table';
import { tap } from 'rxjs/operators';

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

export type LoanStatus = 'ACTIVE' | 'RETURNED' | 'OVERDUE';

export interface LoanMock {
  id: number;
  bookTitle: string;
  borrowerName: string;
  borrowedAt: string; // ISO date, np. '2026-10-01'
  dueAt: string;
  amountDue: number;
  status: LoanStatus;
  tags: LoanTag[];
}

export interface LoanTag {
  label: string;
  type: 'success' | 'warning' | 'danger';
}


@Component({
  selector: 'app-manage-loans',
  standalone: true,
  imports: [CommonModule, AsyncPipe, DataTable],
  templateUrl: './manage-loans.html',
  styleUrl: './manage-loans.scss',
})
export class ManageLoans {
  loansService = inject(LoansService);

  readonly isFormOpen = signal(false);
  form: FormGroup;
  selectedLoan: Loan | null = null;
  saving: boolean = false;

  readonly loansSummary$: Observable<LoansSummary> = this.loansService.getSummaryLoans().pipe(
    tap((data) => console.log('Pobrane kategorie:', data)),
    catchError((err) => {
      console.error('Błąd pobierania profilu', err);
      return of({} as LoansSummary);
    }),
    shareReplay(1),
  );
  getLoanStatsLabel = getLoanStatsLabel;
  statsKeys = Object.values(LoanStatsEnum);

  readonly loanColumns: ColumnDef<LoanMock>[] = [
    {
      key: 'id',
      header: 'ID',
      align: 'left',
    },
    {
      key: 'bookTitle',
      header: 'Tytuł książki',
    },
    {
      key: 'borrowerName',
      header: 'Czytelnik',
    },
    {
      key: 'borrowedAt',
      header: 'Data wypożyczenia',
      accessor: row => row.borrowedAt,
      format: value =>
        new Date(value as string).toLocaleDateString('pl-PL'),
    },
    {
      key: 'dueAt',
      header: 'Termin zwrotu',
      accessor: row => row.dueAt,
      format: value =>
        new Date(value as string).toLocaleDateString('pl-PL'),
    },
    {
      key: 'amountDue',
      header: 'Kwota do zapłaty',
      accessor: row => row.amountDue,
      format: value =>
        new Intl.NumberFormat('pl-PL', {
          style: 'currency',
          currency: 'PLN',
        }).format(value as number),
      align: 'right',
    },
    {
      key: 'status',
      header: 'Status',
      accessor: row => row.status,
      format: value =>
        ({
          ACTIVE: 'Aktywne',
          RETURNED: 'Zwrócone',
          OVERDUE: 'Po terminie',
        }[value as LoanStatus] ?? String(value)),
    },
    {
      key: 'tags',
      header: 'Tagi',
      accessor: row => row.tags,
      // Jeśli na razie nie masz cellTemplate, można wyświetlić etykiety tekstem:
      format: value =>
        (value as LoanTag[]).map(tag => tag.label).join(', '),
    },
  ];

  result = [
    {
      id: '2334',
      book_title: 'dasdfsaf',
    },
    {
      id: '1334',
      book_title: 'ee',
    },
  ];


  private readonly initialQuery: ListQuery = {
    search: '',
    page: 1,
    pageSize: 10,
  };
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

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      bookCopyId: ['', Validators.required],
      userId: ['', Validators.required],
    });
  }

  readonly vm$ = this.query$.pipe(
    switchMap((query) =>
      this.loansService.getUserProfileMock().pipe(
        tap((a) => console.log(a, "a")),
        map((result): any => ({
          items: result,
          query,
          loading: false,
          error: null,
        })),
        tap((a) => console.log(a, "b")),
        catchError(() =>
          of<any>({
            items: [],
            total: 0,
            query,
            loading: false,
            error: 'Nie udało się pobrać książek.',
          }),
        ),
        startWith<any>({
          items: [],
          total: 0,
          query,
          loading: true,
          error: null,
        }),
      ),
    ),
  );

  changePage(page: number): void {
    //this.actions$.next({ type: 'page', page });
  }

  edit(loan: Loan) {
    if (this.saving) {
      return;
    }

    this.selectedLoan = loan;
  }
}
