// dashboard.config.ts
import { Type } from '@angular/core';
import { Catalog } from '../member/catalog/catalog';
import { MyLoans } from '../member/my-loans/my-loans';
import { Fines } from '../member/fines/fines';
import { Reservations } from '../member/reservations/reservations';
import { Profile } from '../member/profile/profile';
import { Panel } from '../member/panel/panel';
import { ManageBooks } from '../librarian/manage-books/manage-books';
import { AdminPanel } from '../librarian/admin-panel/admin-panel';
import { ManageLoans } from '../librarian/manage-loans/manage-loans';

export type ActiveTab =
  | 'catalog'
  | 'loans'
  | 'fines'
  | 'reservations'
  | 'profile'
  | 'messages'
  | 'review'
  | 'panel'
  | 'manage-books'
  | 'manage-loans';

export interface TabConfig {
  id: ActiveTab;
  label: string;
  component: Type<any>;
}

export const MEMBER_TABS: TabConfig[] = [
  { id: 'panel', label: 'Panel Główny', component: Panel },
  { id: 'catalog', label: 'Katalog', component: Catalog },
  { id: 'loans', label: 'Moje Wypożyczenia', component: MyLoans },
  { id: 'reservations', label: 'Rezerwacje', component: Reservations },
  { id: 'fines', label: 'Kary', component: Fines },
  { id: 'profile', label: 'Profil', component: Profile },
];

export const LIBRARIAN_TABS: TabConfig[] = [
  { id: 'panel', label: 'Panel Główny Admina', component: AdminPanel },
  { id: 'manage-books', label: 'Zarządzaj Książkami', component: ManageBooks },
  { id: 'manage-loans', label: 'Zarządzaj Wypożyczeniami', component: ManageLoans },
];
