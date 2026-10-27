import { LoanListItemDto } from './loans.interface.dto.js';

export interface PaginatedLoansDto {
  items: LoanListItemDto[];
  page: number;
  size: number;
  totalItems: number;
  totalPages: number;
}