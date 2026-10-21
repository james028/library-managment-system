import { Component, inject, OnInit } from '@angular/core';
import { BehaviorSubject, catchError, map, of, startWith, switchMap } from 'rxjs';
import { tap } from 'rxjs/operators';
import { MembersService } from './members.service';
import { AsyncPipe } from '@angular/common';
import { DataTable } from '../../../shared/ui/data-table/data-table';
import { MEMBER_COLUMNS } from './member-column';
import { Member, PaginatedMember } from './interfaces/members.interface';
import { membersFilterConfig } from './members.config';
import { FormBuilder } from '@angular/forms';
import { TableFilters } from '../../../shared/ui/table-filters/table-filters';

@Component({
  selector: 'app-members',
  imports: [AsyncPipe, DataTable, TableFilters],
  templateUrl: './members.html',
  styleUrl: './members.scss',
})
export class Members implements OnInit {
  membersService = inject(MembersService);
  fb = inject(FormBuilder);

  readonly membersFilterConfig = membersFilterConfig;

  filtersForm!: any;

  protected readonly memberColumns = MEMBER_COLUMNS;
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
      this.membersService.getMembers().pipe(
        tap((a) => console.log(a.totalItems, 'a')),
        map(
          (
            result: PaginatedMember,
          ): {
            items: Member[];
            total: number;
            query: { search: string; page: number; pageSize: number };
            loading: boolean;
            error: null;
          } => ({
            items: result.items,
            total: result.totalItems,
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

  onFiltersChange(filter: any): void {
    this.filtersForm = filter;

    console.log(filter, "filter");
    console.log(this.filtersForm, "this.filter form");
    // tutaj aktualizujesz obiekt query w strumieniu (search = zlepiony z title/author, page = 1)
    //this.actions$.next({ type: 'filters', filters: filter });
  }

  private buildForm() {
    this.filtersForm = this.fb.group({
      search: [''],
      status: [''],
      createdFrom: [''],
      createdTo: [''],
      hasActiveLoans: [false],
      hasOverdueLoans: [false],
      hasUnpaidFines: [false],
    });
  }

  ngOnInit(): void {
    this.buildForm();
  }
}
