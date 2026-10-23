import { Injectable } from '@angular/core';
import { PageResult, TableAction, TableQuery, TableVm } from './table.types';
import { BehaviorSubject, map, merge, Observable, of, scan, Subject } from 'rxjs';
import { catchError, startWith, switchMap, tap } from 'rxjs/operators';

@Injectable()
export abstract class BaseTableFacade<TItem, TFilters> {
  protected readonly pageSize!: number;
  protected abstract readonly initialFilters: TFilters;
  private readonly actions$ = new Subject<TableAction<TFilters>>();


  readonly query$ = this.actions$.pipe(
    scan((query: TableQuery<TFilters> | any, action: TableAction<TFilters>) => {
      switch (action.type) {
        case 'filters':
          return {
            ...query,
            search: '',
            filters: this.cloneFilters(action.filters),
            page: 1,
          };
        // case 'page':
        //   return {
        //     ...query,
        //     page: action.page,
        //   };
        // case 'resetFilters':
        //   return {
        //     ...query,
        //     filters: this.cloneFilters(this.initialFilters),
        //     search: '',
        //     page: 1,
        //   };
        //   //będzie używany np po strzale na be przy edycji lub usuwaniu
        // case 'refresh':
        //   return {
        //     ...query,
        //   };
      }
    }, this.initialQuery),
    startWith(this.initialQuery)
  );

  readonly vm$: Observable<TableVm<TItem, TFilters>> = this.query$.pipe(
    tap((v) => console.log(v, 'przed switch map')),
    switchMap((query) => (
        this.fetch(query).pipe(
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
        )
    )
    ),
  );

  setFilters(filters: any): void {
    this.actions$.next({
      type: 'filters',
      filters: filters,
    })
  }

  resetFilters(): void {
    this.actions$.next({
      type: 'resetFilters'
    })
  }

  changePage(page: number): void {
    console.log(page, "page");
    this.actions$.next({
      type: 'page',
      page
    })
  }

  //readonly query$ = this.querySubject.asObservable();
  private readonly querySubject = new BehaviorSubject<{
    search: string;
    page: number;
    pageSize: number;
    filters: TFilters;
  }>({
    search: '',
    page: 1,
    pageSize: 10, // @ts-ignore
    filters: this.cloneFilters(this.initialFilters),
  });

  protected abstract fetch(query: TableQuery<TFilters>): Observable<PageResult<TItem>>;

  private get initialQuery(): TableQuery<TFilters> {
    return {
      search: '',
      page: 1,
      //pageSize: this.pageSize,
      filters: this.cloneFilters(this.initialFilters),
    };
  }

  protected cloneFilters(filters: TFilters): TFilters {
    return structuredClone(filters);
  }
}
