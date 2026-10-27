import { Fine } from '../../../../core/services/FinesService';

export type LoanStatus = 'ACTIVE' | 'RETURNED' | 'OVERDUE';

export interface LoanTag {
  label: string;
  type: 'success' | 'warning' | 'danger';
}

export interface LoanMock {
  id: number;
  bookTitle: string;
  borrowerName: string;
  borrowedAt: string;
  dueAt: string;
  amountDue: number;
  status: LoanStatus;
  tags: LoanTag[];
}

export interface LoansSummary {
  activeLoans: number;
  overdueLoans: number;
  toReturnToday: number;
  returnedToday: number;
}

export interface Loan {
  id: string;
  book_copy_id: string;
  user_id: string;
  borrowed_at: string;
  due_at: string;
  returned_at: string | null;
  extended_count: number;
  book_title: string;
  inventory_number: string;
}

export interface LoanView extends Loan {
  isOverdue: boolean;
  fine?: Fine;
}

export interface LoansFilters {
  search: string;
  status: string;
  createdFrom: string;
  createdTo: string;
}

export interface PaginatedLoans {
  items: LoanMock[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface LoanQuery {
  page?: number;
  limit?: number;
  search?: string;
}

export interface LoanMock {
  id: number;
  bookTitle: string;
  borrowerName: string;
  borrowedAt: string; // ISO date, np. '2026-10-01'
  dueAt: string;
  amountDue: number;
  status: LoanStatus;
  tags: LoanTag[];
}

export enum LoanStatsEnum {
  ACTIVE_LOANS = 'activeLoans',
  OVERDUE_LOANS = 'overdueLoans',
  TO_RETURN_TODAY = 'toReturnToday',
  RETURNED_TODAY = 'returnedToday',
}

export type LoanStatsKey = `${LoanStatsEnum}`;

