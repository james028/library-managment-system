import { Member } from '../../features/librarian/members/interfaces/members.interface';

export interface PageResult<TItem> {
  items: TItem[];
  total: number;
}

export interface PaginatedMember {
  items: Member[];
  page: number;
  size: number;
  totalItems: number;
  totalPages: number;
}

export interface TableVm<TItem, TFilters> {
  items: TItem[];
  total: number;
  loading: boolean;
  error: string | null;
  query: TableQuery<TFilters>;
}

export interface TableQuery<TFilters> {
  page: number;
  filters: TFilters;
}

export type TableAction<TFilters> =
  | { type: 'apply'; filters: TFilters }
  | { type: 'page'; page: number }
  | {
      type: 'resetFilters';
    }
  | { type: 'refresh' };
