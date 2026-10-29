import { ColumnDef } from '../../../shared/ui/data-table/data-table';
import { LoanListItem } from './models/loan-model';

export const LOAN_COLUMNS: ColumnDef<LoanListItem>[] = [
  {
    key: '',
    header: 'ID',
    align: 'left',
    accessor: (row) => row.loan.id,
  },
  {
    key: '',
    header: 'Imię i nazwisko',
    align: 'left',
    accessor: (row) => `${row.loan.member.firstName} ${row.loan.member.lastName}`,
  },
  {
    key: '',
    header: 'Email',
    align: 'left',
    accessor: (row) => `${row.loan.member.email}`,
  },
  {
    key: '',
    header: 'Status wypożyczenia',
    accessor: (row) => row.loan.status,
    format: (value) =>
      ({
        ACTIVE: 'Aktywne',
        OVERDUE: 'Zaległe',
        RETURNED: 'Zwrócone',
      })[value as 'RETURNED' | 'ACTIVE' | 'OVERDUE'] ?? String(value),
  },
  {
    key: '',
    header: 'Id kopii książki',
    align: 'left',
    accessor: (row) => row.loan.bookCopy.book.id,
  },
  {
    key: '',
    header: 'Autor i tytuł książki',
    align: 'left',
    accessor: (row) => `${row.loan.bookCopy.book.author} - ${row.loan.bookCopy.book.title}`,
  },
  {
    key: '',
    header: 'Dni przetrzymane',
    align: 'left',
    accessor: (row) => row.loan.daysOverdue,
  },
  {
    key: '',
    header: 'Ilość prolognat',
    align: 'left',
    accessor: (row) => row.loan.extendedCount,
  },
  {
    key: '',
    header: 'Termin zwrotu',
    align: 'left',
    accessor: (row) => row.loan.dueAt,
    format: (value) =>
      value ? new Date(value as string).toLocaleDateString('pl-PL') : '—',  },
  {
    key: 'returnedAt',
    header: 'Zwrócone',
    align: 'left',
    accessor: (row) => row.loan.returnedAt,
    format: (value) =>
      value ? new Date(value as string).toLocaleDateString('pl-PL') : '—',  },
];
