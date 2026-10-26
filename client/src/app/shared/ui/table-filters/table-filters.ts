import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

export type FilterKind = 'text' | 'select' | 'number' | 'date' | 'boolean';

export interface FilterOption {
  value: string | number;
  label: string;
}

export interface FilterFieldConfig {
  key: string;
  kind: FilterKind;
  label: string;
  placeholder?: string;
  options?: FilterOption[];
}

export type FiltersFormValue = Record<string, string | number | boolean | null>;

@Component({
  selector: 'app-table-filters',
  standalone: true,
  imports: [ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './table-filters.html',
  styleUrl: './table-filters.scss',
})
export class TableFilters implements OnInit {
  @Output() readonly apply = new EventEmitter<FiltersFormValue>();
  @Output() readonly reset = new EventEmitter<void>();

  readonly form = new FormGroup({});
  private pendingValue: FiltersFormValue | null = null;
  private isFormReady = false;

  constructor(private readonly fb: FormBuilder) {}

  private _config: FilterFieldConfig[] = [];

  get config(): FilterFieldConfig[] {
    return this._config;
  }

  @Input() set config(config: FilterFieldConfig[]) {
    this._config = config;
    this.buildForm();
    this.patchPendingValue();
  }

  @Input() set value(value: FiltersFormValue | null) {
    this.pendingValue = value;

    if (this.isFormReady) {
      this.patchFormValue(value);
    }
  }

  ngOnInit(): void {
    if (!this.isFormReady) {
      this.buildForm();
      this.patchPendingValue();
    }
  }

  applyFilters(): void {
    this.apply.emit(this.form.getRawValue() as FiltersFormValue);
  }

  resetFilters(): void {
    const initialValue = this.createInitialValue();

    this.form.reset(initialValue, { emitEvent: false });

    this.reset.emit();
  }

  private buildForm(): void {
    this.form.controls = {};

    for (const field of this._config) {
      const control =
        field.kind === 'boolean' ? this.fb.nonNullable.control(false) : this.fb.control('');

      this.form.addControl(field.key, control);
    }

    this.isFormReady = true;
  }

  private patchPendingValue(): void {
    if (this.pendingValue) {
      this.patchFormValue(this.pendingValue);
    }
  }

  private patchFormValue(value: FiltersFormValue | null): void {
    if (!value) {
      return;
    }

    const safeValue: Record<string, unknown> = {};

    for (const key of Object.keys(this.form.controls)) {
      if (key in value) {
        safeValue[key] = value[key];
      }
    }

    this.form.patchValue(safeValue as never, { emitEvent: false });
  }

  private createInitialValue(): FiltersFormValue {
    return Object.fromEntries(
      this._config.map((field) => [field.key, this.getInitialValueForKind(field.kind)]),
    ) as FiltersFormValue;
  }

  private getInitialValueForKind(kind: FilterKind): string | boolean | number {
    switch (kind) {
      case 'boolean':
        return false;

      case 'number':
        return '';

      case 'date':
      case 'select':
      case 'text':
      default:
        return '';
    }
  }
}
