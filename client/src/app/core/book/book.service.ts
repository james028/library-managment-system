import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.js';

export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string | null;
  publisher: string | null;
  published_year: number | null;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface PaginatedBooks {
  items: Book[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface BooksQuery {
  page?: number;
  limit?: number;
  search?: string;
}

// Kształt body wysyłanego do POST/PATCH — zgodny z CreateBookDto/UpdateBookDto z Nest.
export interface BookFormValue {
  title: string;
  author: string;
  isbn?: string;
  publisher?: string;
  publishedYear?: number;
  description?: string;
}

@Injectable({ providedIn: 'root' })
export class BooksService {
  private readonly baseUrl = `${environment.apiUrl}/books`;

  constructor(private http: HttpClient) {}

  // Zwraca Observable, NIE Promise — komponent decyduje, jak z tego skorzysta
  // (async pipe w szablonie albo .subscribe() ręcznie). Serwis się tym nie zajmuje.
  getBooks(query: BooksQuery): Observable<PaginatedBooks> {
    let params = new HttpParams();

    if (query.page) params = params.set('page', query.page);
    if (query.limit) params = params.set('limit', query.limit);
    if (query.search) params = params.set('search', query.search);

    return this.http.get<PaginatedBooks>(this.baseUrl, { params });
  }

  createBook(payload: BookFormValue): Observable<Book> {
    return this.http.post<Book>(this.baseUrl, payload);
  }

  updateBook(editId: string, payload: Partial<BookFormValue>): Observable<Book> {
    return this.http.patch<Book>(`${this.baseUrl}/${editId}`, payload);
  }


}
