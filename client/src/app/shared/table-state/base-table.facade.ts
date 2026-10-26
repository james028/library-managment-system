import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { catchError, map, scan, startWith, switchMap, tap } from 'rxjs/operators';

import {
  TableAction,
  TableQuery,
  TableVm,
} from './table.types';
import { PaginatedResult } from '../../features/librarian/members/data-access/members.service';

@Injectable()
export abstract class BaseTableFacade<
  TItem,
  TFilters,
  TResponse extends PaginatedResult<TItem> = PaginatedResult<TItem>,
> {
  private readonly actions$ = new Subject<TableAction<TFilters>>();

  readonly query$: Observable<TableQuery<TFilters>>;
  readonly vm$: Observable<TableVm<TItem, TFilters>>;

  protected constructor(
    private readonly initialFilters: TFilters,
    private readonly fetchFn: (
      query: TableQuery<TFilters>,
    ) => Observable<TResponse>,
  ) {
    const initialQuery: TableQuery<TFilters> = {
      page: 1,
      //pageSize: 10,
      filters: this.cloneFilters(this.initialFilters),
    };

    this.query$ = this.actions$.pipe(
      scan(
        (
          query: TableQuery<TFilters>,
          action: TableAction<TFilters>,
        ): TableQuery<TFilters> => {
          switch (action.type) {
            case 'apply':
              return {
                ...query,
                filters: this.cloneFilters(action.filters),
                page: 1,
              };

            case 'page':
              return {
                ...query,
                page: action.page,
              };

            case 'resetFilters':
              return {
                ...query,
                filters: this.cloneFilters(this.initialFilters),
                page: 1,
              };

            case 'refresh':
              return {
                ...query,
              };

            default:
              return query;
          }
        },
        initialQuery,
      ),
      startWith(initialQuery),
    );

    this.vm$ = this.query$.pipe(
      tap((query) => console.log('query before switchMap', query)),
      switchMap((query) =>
        this.fetchFn(query).pipe(
          map(
            (result): TableVm<TItem, TFilters> => ({
              items: result.items,
              total: result.totalItems,
              query,
              loading: false,
              error: null,
            }),
          ),
          catchError(() =>
            of<TableVm<TItem, TFilters>>({
              items: [],
              total: 0,
              query,
              loading: false,
              error: 'Nie udało się pobrać danych.',
            }),
          ),
          startWith<TableVm<TItem, TFilters>>({
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

  applySubmit(filters: TFilters): void {
    this.actions$.next({
      type: 'apply',
      filters,
    });
  }

  resetFilters(): void {
    this.actions$.next({ type: 'resetFilters' });
  }

  changePage(page: number): void {
    this.actions$.next({ type: 'page', page });
  }

  refresh(): void {
    this.actions$.next({ type: 'refresh' });
  }

  protected cloneFilters(filters: TFilters): TFilters {
    return structuredClone(filters);
  }
}
