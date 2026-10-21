import { FilterFieldConfig } from '../../../shared/ui/table-filters/table-filters';

export const membersFilterConfig: FilterFieldConfig[] = [
  {
    key: 'search',
    kind: 'text',
    label: 'Wyszukaj',
    placeholder: 'Szukaj po imieniu, nazwisku, mailu lub numerze karty',
  },
  {
    key: 'status',
    kind: 'select',
    label: 'Status',
    placeholder: 'Szukaj statusu',
    options: [
      { value: 'ACTIVE', label: 'Aktywny' },
      { value: 'BLOCKED', label: 'Zablokowany' },
    ],
  },
  {
    key: 'createdFrom',
    kind: 'date',
    label: 'Data od',
    placeholder: 'Szukaj po dacie od',
  },
  {
    key: 'createdTo',
    kind: 'date',
    label: 'Data do',
    placeholder: 'Szukaj po dacie do',
  },
  {
    key: 'hasActiveLoans',
    label: 'Aktywne wypożyczenia',
    kind: 'boolean',
    placeholder: 'Tylko z aktywnymi wypożyczeniami',
  },
  {
    key: 'hasOverdueLoans',
    label: 'Przeterminowane wypożyczenia',
    kind: 'boolean',
    placeholder: 'Tylko z przeterminowanymi wypożyczeniami',
  },
  {
    key: 'hasUnpaidFines',
    label: 'Niezapłacone kary',
    kind: 'boolean',
    placeholder: 'Tylko z niezapłaconymi karami',
  },
]
