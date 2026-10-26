import { FormControl, FormGroup } from '@angular/forms';

export interface MemberMock {
  id: number;
  firstName: string;
  lastName: string;
  cardNumber: string;
  email: string;
  phone: string | null;
  status: string;
  activeLoans: number;
  activeReservations: number;
  unpaidFinesAmount: string;
  createdAt: string;
}

export interface Member {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  cardNumber: string;
  status: 'ACTIVE' | 'BLOCKED';
  createdAt: string;
  updatedAt: string;
  activeLoans: number;
  totalUnpaidFinesAmount: string;
}

export interface PaginatedMember {
  items: Member[];
  page: number;
  size: number;
  totalItems: number;
  totalPages: number;
}

export type MembersFiltersForm = FormGroup<{
  search: FormControl<string>;
  status: FormControl<string>;
  createdFrom: FormControl<string>;
  createdTo: FormControl<string>;
  hasActiveLoans: FormControl<boolean>;
  hasOverdueLoans: FormControl<boolean>;
  hasUnpaidFines: FormControl<boolean>;
}>;

export interface MembersFilters {
  status: string;
  createdFrom: string;
  createdTo: string;
  hasActiveLoans: boolean;
  hasOverdueLoans: boolean;
  hasUnpaidFines: boolean;
}

export interface MembersFiltersFormValue extends MembersFilters {
  search: string;
}
