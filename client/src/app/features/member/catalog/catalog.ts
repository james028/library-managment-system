import { Component } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { debounceTime, distinctUntilChanged, startWith, switchMap, tap } from 'rxjs/operators';
import { BooksService } from '../../../core/book/book.service.js';

const PAGE_SIZE = 10;

@Component({
  selector: 'app-catalog',
  imports: [AsyncPipe, ReactiveFormsModule],
  templateUrl: 'catalog.html',
  styleUrl: './catalog.scss',
})
export class Catalog {
  readonly searchControl = new FormControl('', { nonNullable: true });
  private readonly page$ = new BehaviorSubject<number>(1);

  private readonly search$ = this.searchControl.valueChanges.pipe(
    startWith(''),
    debounceTime(300),
    distinctUntilChanged(),
    tap(() => this.page$.next(1)), // nowe wyszukiwanie zawsze wraca na stronę 1
  );

  readonly books$ = combineLatest([this.search$, this.page$]).pipe(
    tap(([search, page]) => console.log(`Szukam: "${search}", strona: ${page}`)),
    switchMap(([search, page]) =>
      this.booksService.getBooks({ search: search || undefined, page, limit: PAGE_SIZE }),
    ),
  );

  constructor(private booksService: BooksService) {
    this.books$.subscribe((data) => {
      console.log('Otrzymane książki z API:', data);
    });
  }

  goToPage(page: number): void {
    this.page$.next(page);
  }
}
