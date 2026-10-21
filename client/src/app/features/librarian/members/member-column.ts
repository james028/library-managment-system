import { ColumnDef } from '../../../shared/ui/data-table/data-table';
import { Member } from './interfaces/members.interface';

export const MEMBER_COLUMNS: ColumnDef<Member>[] = [
  {
    key: 'id',
    header: 'Id',
    align: 'left',
  },
  {
    key: '',
    header: 'Imię i nazwisko',
    accessor: (row) => `${row.firstName} ${row.lastName}`,
  },
  {
    key: 'cardNumber',
    header: 'Numer karty bibliotecznej',
  },
  {
    key: 'email',
    header: 'Email',
  },
  {
    key: 'status',
    header: 'Status konta',
    accessor: (row) => row.status,
    format: (value) =>
      ({
        ACTIVE: 'Aktywne',
        BLOCKED: 'Zablokowane',
      })[value as 'BLOCKED' | 'ACTIVE'] ?? String(value),
  },
  {
    key: 'email',
    header: 'Email',
  },
  {
    key: 'activeLoans',
    header: 'Aktywne wypożyczenia',
    accessor: (row) => (+row.activeLoans),
  },
  {
    key: 'totalUnpaidFinesAmount',
    header: 'Kwota niezapłaconych kar',
    accessor: (row) => `${+row.totalUnpaidFinesAmount} zł`,
  },
  {
    key: 'createdAt',
    header: 'Data stworzenia czytelnika',
    accessor: (row) => row.createdAt,
    format: (value) => new Date(value as string).toLocaleDateString('pl-PL'),
  },
  {
    key: 'updatedAt',
    header: 'Data aktualizacji danych czytelnika',
    accessor: (row) => row.updatedAt,
    format: (value) => new Date(value as string).toLocaleDateString('pl-PL'),
  },
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
  // },
];
