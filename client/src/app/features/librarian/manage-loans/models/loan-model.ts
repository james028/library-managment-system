import { Fine } from '../../../../core/services/FinesService';

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

export interface LoanView {
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


export type LoanStatus = 'ACTIVE' | 'OVERDUE' | 'RETURNED';

export type BookCopyCondition = 'new' | 'good' | 'worn' | 'damaged';

export type MemberRole = 'member' | 'librarian' | 'admin';

export interface LoanBook {
  id: string;
  title: string;
  author: string;
}

export interface LoanBookCopy {
  id: string;
  book: LoanBook;
  condition: BookCopyCondition;
  inventory_number: string;
}

export interface LoanMember {
  id: string;
  role: MemberRole;
  email: string;
  lastName: string;
  firstName: string;
}

export interface Loan {
  id: string;
  dueAt: string;
  member: LoanMember;
  status: LoanStatus;
  bookCopy: LoanBookCopy;
  isOverdue: boolean;
  borrowedAt: string;
  returnedAt: string | null;
  daysOverdue: number;
  extendedCount: number;
}

export interface LoanListItem {
  loan: Loan;
}

export type LoanListResponse = LoanListItem[];

export type LoanSortField =
  | 'borrowedAt'
  | 'dueAt'
  | 'returnedAt'
  | 'status';

export type SortDirection = 'ASC' | 'DESC';

export interface LoanFilters {
  search?: string;
  status?: LoanStatus | string;
  memberId?: string;
  bookId?: string;
  bookCopyId?: string;
  borrowedFrom?: string;
  borrowedTo?: string;
  dueFrom?: string;
  dueTo?: string;
  returnedFrom?: string;
  returnedTo?: string;
  active?: boolean;
  overdue?: boolean;
}

export interface LoanQueryParams extends LoanFilters {
  page?: number;
  limit?: number;
  //sortBy?: LoanSortField;
  //sortDirection?: SortDirection;
}

