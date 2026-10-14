import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

export interface PageResult<T> {
  items: T[];
  total: number;
}

export interface ListQuery {
  search: string;
  page: number;
  pageSize: number;
}

type QueryAction =
  | { type: 'search'; search: string }
  | { type: 'page'; page: number }
  | { type: 'refresh' };

export interface TableColumn<T> {
  key: keyof T;
  label: string;
}

export interface ColumnDef<T> {
  key: string;
  header: string;

  /** Skąd pobrać wartość. Domyślnie: row[column.key] */
  accessor?: (row: T) => unknown;

  /** Jak przekształcić wartość na tekst do wyświetlenia */
  format?: (value: unknown, row: T) => string;

  sortable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

@Component({
  selector: 'app-data-table',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  templateUrl: './data-table.html',
  styleUrl: './data-table.scss',
})
export class DataTable<T extends {id: string | number }> {
  @Input({ required: true }) rows: T[] = [];
  @Input({ required: true }) columns: ColumnDef<T>[] = [];
  @Input() loading = false;
  @Input() error: string | null = null;
  @Input() total = 0;
  @Input() page = 1;
  @Input() pageSize = 10;

  @Output() readonly pageChange = new EventEmitter<number>();
  @Output() readonly edit = new EventEmitter<T>();

  getValue(row: T, column: ColumnDef<T>): string {
    const raw = column.accessor
      ? column.accessor(row)
      : (row as Record<string, unknown>)[column.key];

    return column.format ? column.format(raw, row) : String(raw ?? '');
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.total / this.pageSize));
  }
}
