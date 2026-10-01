import { Routes } from '@angular/router';
import { authGuard } from './core/auth/auth.guard';
import { roleGuard } from './core/auth/role.guard';
import { ManageBooks } from './features/librarian/manage-books/manage-books';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login').then((m) => m.LoginComponent),
  },

  // dostępne dla KAŻDEGO zalogowanego — sam authGuard, bez roleGuard
  {
    path: 'profile',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./shared/profile/profile').then((m) => m.Profile),
  },

  // tylko member — oba guardy na raz, w kolejności: najpierw "czy zalogowany",
  // potem "czy pasująca rola". Angular uruchamia je po kolei i przerywa na pierwszym false.
  {
    path: 'app',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['member'] },
    children: [
      {
        path: 'catalog',
        loadComponent: () =>
          import('./features/member/catalog/catalog').then((m) => m.Catalog),
      },
      {
        path: 'loans',
        loadComponent: () =>
          import('./features/member/my-loans/my-loans').then((m) => m.MyLoans),
      },
    ],
  },

  // tylko librarian
  {
    path: 'admin',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['librarian'] },
    children: [
      {
        path: 'books',
        loadComponent: () =>
          import('./features/librarian/manage-books/manage-books').then(
            (m) => m.ManageBooks,
          ),
      },
      {
        path: 'loans',
        loadComponent: () =>
          import('./features/librarian/manage-loans/manage-loans').then(
            (m) => m.ManageLoans,
          ),
      },
    ],
  },

  { path: '', redirectTo: 'login', pathMatch: 'full' },
];
