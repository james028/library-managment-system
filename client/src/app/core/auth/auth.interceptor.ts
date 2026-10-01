import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

// Funkcyjny interceptor (nowy styl, zamiast klasy implementującej HttpInterceptor) —
// rejestrowany w app.config.ts przez provideHttpClient(withInterceptors([authInterceptor])).
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const token = localStorage.getItem('accessToken');

  const clonedRequest = token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;
  // HttpRequest jest niemutowalny — stąd .clone(), nie bezpośrednia modyfikacja req.headers.

  return next(clonedRequest).pipe(
    catchError((error) => {
      if (error.status === 401) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        router.navigate(['/login']);
      }
      return throwError(() => error);
    }),
  );
};
