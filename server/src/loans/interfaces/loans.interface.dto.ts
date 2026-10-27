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