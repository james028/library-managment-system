export type LoanStatus = 'ACTIVE' | 'OVERDUE' | 'RETURNED';

export interface LoanListItemDto {
  id: number;
  status: LoanStatus;
  borrowedAt: Date;
  dueAt: Date;
  returnedAt: Date | null;
  extendedCount: number;
  isOverdue: boolean;
  daysOverdue: number;

  bookCopy: {
    id: number;
    barcode: string;
    book: {
      id: number;
      title: string;
      author: string;
    };
  };

  member: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    cardNumber: string;
  };
}

export interface LoanFilters {
  search?: string;
  status?: LoanStatus;
  memberId?: string;
  bookId?: string;
  bookCopyId?: string;
  borrowedFrom?: string;
  borrowedTo?: string;
  dueFrom?: string;
  dueTo?: string;
  returnedFrom?: string;
  returnedTo?: string;
  overdue?: boolean;
  active?: boolean;
}
