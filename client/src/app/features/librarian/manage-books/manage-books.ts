import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { debounceTime, startWith, switchMap, tap } from 'rxjs/operators';
import { BooksService, Book, PaginatedBooks } from '../../../core/book/book.service';

@Component({
  selector: 'app-manage-books',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './manage-books.html',
  styleUrl: './manage-books.scss',
})
export class ManageBooks {
  booksService = inject(BooksService);

  readonly isFormOpen = signal(false);
  readonly editingBook = signal<Book | null>(null);

  searchControl: FormControl;
  form: FormGroup;

  search$!: Observable<string>;
  page$ = new BehaviorSubject<number>(1);
  books$!: Observable<PaginatedBooks>;

  constructor(private fb: FormBuilder) {
    this.searchControl = this.fb.control('', { nonNullable: true });
    this.form = this.fb.group({
      title: ['', Validators.required],
      author: ['', Validators.required],
      isbn: [''],
      publisher: [''],
      publishedYear: [null as number | null],
      description: [''],
    });

    this.search$ = this.searchControl.valueChanges.pipe(startWith(''), debounceTime(300));

    this.books$ = combineLatest([this.search$, this.page$]).pipe(
      switchMap(([search, page]) =>
        this.booksService.getBooks({
          search: search || undefined,
          page,
          limit: 10,
        }),
      ),
      tap((val) => console.log(val)),
    );
  }

  nextPage() {
    this.page$.next(this.page$.getValue() + 1);
  }

  openCreateForm() {
    this.isFormOpen.set(true);
  }

  openEditForm(book: Book) {
    this.editingBook.set(book);
    this.form.patchValue({
      title: book.title,
      author: book.author,
      isbn: book.isbn ?? '',
      publisher: book.publisher ?? '',
      publishedYear: book.published_year,
      description: book.description ?? '',
    });
    this.isFormOpen.set(true);
  }

  submit() {}

  cancelForm() {
    this.isFormOpen.set(false);
    //this.editingBook.set(null);
    this.form.reset();
  }
}
