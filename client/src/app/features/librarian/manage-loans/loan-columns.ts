import { ColumnDef } from '../../../shared/ui/data-table/data-table';
import { Loan, LoanMock, LoanStatus, LoanTag } from './models/loan-model';

export const LOAN_COLUMNS: ColumnDef<Loan>[] = [
  {
    key: 'id',
    header: 'ID',
    align: 'left',
  },
  // {
  //   key: 'bookTitle',
  //   header: 'Tytuł książki',
  // },
  // {
  //   key: 'borrowerName',
  //   header: 'Czytelnik',
  // },
  // {
  //   key: 'borrowedAt',
  //   header: 'Data wypożyczenia',
  //   accessor: (row) => row.borrowedAt,
  //   format: (value) => new Date(value as string).toLocaleDateString('pl-PL'),
  // },
  // {
  //   key: 'dueAt',
  //   header: 'Termin zwrotu',
  //   accessor: (row) => row.dueAt,
  //   format: (value) => new Date(value as string).toLocaleDateString('pl-PL'),
  // },
  // {
  //   key: 'amountDue',
  //   header: 'Kwota do zapłaty',
  //   accessor: (row) => row.amountDue,
  //   format: (value) =>
  //     new Intl.NumberFormat('pl-PL', {
  //       style: 'currency',
  //       currency: 'PLN',
  //     }).format(value as number),
  //   align: 'right',
  // },
  // {
  //   key: 'status',
  //   header: 'Status',
  //   accessor: (row) => row.status,
  //   format: (value) =>
  //     ({
  //       ACTIVE: 'Aktywne',
  //       RETURNED: 'Zwrócone',
  //       OVERDUE: 'Po terminie',
  //     })[value as LoanStatus] ?? String(value),
  // },
  // {
  //   key: 'tags',
  //   header: 'Tagi',
  //   accessor: (row) => row.tags, // Jeśli na razie nie masz cellTemplate, można wyświetlić etykiety tekstem:
  //   format: (value) => (value as LoanTag[]).map((tag) => tag.label).join(', '),
  //},
];
