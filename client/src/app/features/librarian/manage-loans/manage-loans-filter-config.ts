import { FilterFieldConfig } from '../../../shared/ui/table-filters/table-filters';

export const loansFilterConfig: FilterFieldConfig[] = [
  {
    key: 'search',
    kind: 'text',
    label: 'Wyszukaj',
    placeholder:
      'Szukaj po tytule, autorze, barcode, numerze karty, e-mailu lub czytelniku',
  },
  {
    key: 'status',
    kind: 'select',
    label: 'Status',
    placeholder: 'Wybierz status',
    options: [
      { value: 'ACTIVE', label: 'Aktywne' },
      { value: 'OVERDUE', label: 'Przeterminowane' },
      { value: 'RETURNED', label: 'Zwrócone' },
    ],
  },
  {
    key: 'memberId',
    kind: 'text',
    label: 'ID czytelnika',
    placeholder: 'Wklej ID czytelnika',
  },
  {
    key: 'bookId',
    kind: 'text',
    label: 'ID książki',
    placeholder: 'Wklej ID książki',
  },
  {
    key: 'bookCopyId',
    kind: 'text',
    label: 'ID egzemplarza',
    placeholder: 'Wklej ID egzemplarza',
  },
  {
    key: 'borrowedFrom',
    kind: 'date',
    label: 'Wypożyczone od',
    placeholder: 'Data wypożyczenia od',
  },
  {
    key: 'borrowedTo',
    kind: 'date',
    label: 'Wypożyczone do',
    placeholder: 'Data wypożyczenia do',
  },
  {
    key: 'dueFrom',
    kind: 'date',
    label: 'Termin zwrotu od',
    placeholder: 'Termin zwrotu od',
  },
  {
    key: 'dueTo',
    kind: 'date',
    label: 'Termin zwrotu do',
    placeholder: 'Termin zwrotu do',
  },
  {
    key: 'returnedFrom',
    kind: 'date',
    label: 'Zwrócone od',
    placeholder: 'Data zwrotu od',
  },
  {
    key: 'returnedTo',
    kind: 'date',
    label: 'Zwrócone do',
    placeholder: 'Data zwrotu do',
  },
  {
    key: 'active',
    label: 'Niezwrócone',
    kind: 'boolean',
    placeholder: 'Tylko niezwrócone wypożyczenia',
  },
  {
    key: 'overdue',
    label: 'Przeterminowane',
    kind: 'boolean',
    placeholder: 'Tylko niezwrócone po terminie',
  },
];
