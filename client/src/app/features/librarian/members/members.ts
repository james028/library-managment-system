import { Component, inject } from '@angular/core';
import { BehaviorSubject, catchError, map, of, startWith, switchMap } from 'rxjs';
import { tap } from 'rxjs/operators';
import { MembersService } from './members.service';
import { MemberMock } from './interfaces/members.interface';
import { AsyncPipe } from '@angular/common';
import { DataTable } from '../../../shared/ui/data-table/data-table';
import { MEMBER_COLUMNS } from './member-column';

@Component({
  selector: 'app-members',
  imports: [AsyncPipe, DataTable],
  templateUrl: './members.html',
  styleUrl: './members.scss',
})
export class Members {
  membersService = inject(MembersService);

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
        tap((a) => console.log(a, 'a')),
        map(
          (
            result,
          ): {
            items: MemberMock[];
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
}
