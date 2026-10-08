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
import { firstValueFrom } from 'rxjs';

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
  books$!: Observable<PaginatedBooks>;

  page$ = new BehaviorSubject<number>(1);
  refresh$ = new BehaviorSubject<boolean>(false);

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

    this.books$ = combineLatest([this.search$, this.page$, this.refresh$]).pipe(
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

  async submit() {
    if (this.form.invalid) return;

    //this.errorMessage.set(null);
    const raw = this.form.getRawValue();

    // Czyścimy puste stringi na undefined, żeby nie wysyłać "" tam, gdzie backend
    // oczekuje braku pola (@IsOptional w DTO) — pusty string i brak pola to nie to samo.
    const payload = {
      title: raw.title,
      author: raw.author,
      isbn: raw.isbn || undefined,
      publisher: raw.publisher || undefined,
      publishedYear: raw.publishedYear ?? undefined,
      description: raw.description || undefined,
    };

    try {
      const editing = this.editingBook();
      if (editing) {
        await firstValueFrom(this.booksService.updateBook(editing.id, payload));
      } else {
        await firstValueFrom(this.booksService.createBook(payload));
      }
      this.cancelForm();
      this.refresh$.next(true); // odpala ponowne pobranie listy
    } catch (error: any) {
      //this.errorMessage.set(error.error?.message ?? 'Nie udało się zapisać książki');
    }
  }

  cancelForm() {
    this.isFormOpen.set(false);
    this.editingBook.set(null);
    this.form.reset();
  }
}
