import { Routes } from '@angular/router';
import { authGuard } from './core/auth/auth.guard';
import { roleGuard } from './core/auth/role.guard';
import { Layout } from './shared/layout/layout';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login').then((m) => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/register/register').then((m) => m.Register),
  },

  { path: '', pathMatch: 'full', redirectTo: 'login' },
  {
    path: '',
    component: Layout,
    canActivate: [authGuard],
    children: [
      {
        path: 'app',
        canActivate: [roleGuard], // dodatkowy guard TYLKO na sprawdzenie roli, autoryzacja już zrobiona wyżej
        data: { roles: ['member'] },
        children: [
          {
            path: 'dashboard',
            loadComponent: () =>
              import('./features/dashboard/member-dashboard/dashboard').then(
                (m) => m.MemberDashboard,
              ),
          },
          {
            path: 'panel',
            loadComponent: () => import('./features/member/panel/panel').then((m) => m.Panel),
          },
          {
            path: 'catalog',
            loadComponent: () => import('./features/member/catalog/catalog').then((m) => m.Catalog),
          },
          {
            path: 'loans',
            loadComponent: () =>
              import('./features/member/my-loans/my-loans').then((m) => m.MyLoans),
          },
          {
            path: 'reservations',
            loadComponent: () =>
              import('./features/member/reservations/reservations').then((m) => m.Reservations),
          },
          {
            path: 'fines',
            loadComponent: () => import('./features/member/fines/fines').then((m) => m.Fines),
          },
          {
            path: 'profile',
            loadComponent: () => import('./features/member/profile/profile').then((m) => m.Profile),
          },
        ],
      },
      {
        path: 'admin',
        canActivate: [roleGuard],
        data: { roles: ['librarian'] },
        children: [
          {
            path: 'dashboard',
            loadComponent: () =>
              import('./features/dashboard/librarian-dashboard/librarian-dashboard').then(
                (m) => m.LibrarianDashboard,
              ),
          },
          {
            path: 'books',
            loadComponent: () =>
              import('./features/librarian/manage-books/manage-books').then((m) => m.ManageBooks),
          },
          {
            path: 'loans',
            loadComponent: () =>
              import('./features/librarian/manage-loans/manage-loans').then((m) => m.ManageLoans),
          },
        ],
      },
    ],
  },
];
