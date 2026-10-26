import { Injectable } from '@angular/core';
import { PageResult, TableAction, TableQuery, TableVm } from './table.types';
import { map, Observable, of, scan, Subject } from 'rxjs';
import { catchError, startWith, switchMap, tap } from 'rxjs/operators';

@Injectable()
export abstract class BaseTableFacade<TItem, TFilters> {
  readonly query$: Observable<TableQuery<TFilters>>;
  readonly vm$: Observable<TableVm<TItem, TFilters>>;
  //protected readonly pageSize!: number;
  private readonly actions$ = new Subject<TableAction<TFilters>>();

  protected constructor(
    private readonly initialFilters: TFilters,
    private readonly fetchFn: (query: TableQuery<TFilters>) => Observable<PageResult<TItem>>,
  ) {
    const initialQuery: TableQuery<TFilters> = {
      page: 1,
      filters: this.cloneFilters(this.initialFilters),
    };

    this.query$ = this.actions$.pipe(
      scan((query: TableQuery<TFilters>, action: TableAction<TFilters>) => {
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
          default:
            return query;
          //będzie używany np po strzale na be przy edycji lub usuwaniu
          // case 'refresh':
          //   return {
          //     ...query,
          //   };
        }
      }, initialQuery),
      startWith(initialQuery),
    );

    this.vm$ = this.query$.pipe(
      tap((v) => console.log(v, 'przed switch map')),
      switchMap((query) =>
        this.fetchFn(query).pipe(
          map((result): TableVm<TItem, TFilters> => ({
            items: result.items,
            total: result.total,
            query,
            loading: false,
            error: null,
          })),
          startWith({
            items: [],
            total: 0,
            query,
            loading: true,
            error: null,
          }),
          catchError(() =>
            of<TableVm<TItem, TFilters>>({
              items: [],
              total: 0,
              query,
              loading: false,
              error: 'Nie udało się pobrać danych.',
            }),
          ),
        ),
      ),
    );
  }

  applySubmit(filters: any): void {
    console.log(filters, ' w type facade');
    this.actions$.next({
      type: 'apply',
      filters: filters,
    });
  }

  resetFilters(): void {
    this.actions$.next({
      type: 'resetFilters',
    });
  }

  changePage(page: number): void {
    this.actions$.next({
      type: 'page',
      page,
    });
  }

  protected cloneFilters(filters: TFilters): TFilters {
    return structuredClone(filters);
  }
}
