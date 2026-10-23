import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

export type FilterKind = 'text' | 'select' | 'number' | 'date' | 'boolean';

export interface FilterOption {
  value: string | number;
  label: string;
}

export interface FilterFieldConfig {
  key: string; // nazwa pola w obiekcie filtra (np. 'title', 'status')
  kind: FilterKind;
  label: string;
  placeholder?: string;
  options?: FilterOption[];
}

@Component({
  selector: 'app-table-filters',
  standalone: true,
  imports: [ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './table-filters.html',
  styleUrl: './table-filters.scss',
})
export class TableFilters implements OnInit {
  @Input({ required: true }) config: FilterFieldConfig[] = [];
  @Input() set value(value: Record<string, unknown> | null) {
    if(!value) {
      return;
    }
    this.form.patchValue(value ?? {}, { emitEvent: false });
  }

  @Output() readonly valueChange =
    new EventEmitter<Record<string, unknown>>();
  @Output() readonly apply = new EventEmitter<any>();
  @Output() readonly reset = new EventEmitter<void>();


  readonly form = new FormGroup({});

  constructor(private readonly fb: FormBuilder) {
  }

  ngOnInit() {
    this.buildForm();

    this.form.valueChanges.subscribe((values) => {
      this.valueChange.emit(values);
    })
  }

  // applyFilters(): void {
  //   this.apply.emit(this.form.getRawValue());
  // }

  resetFilters(): void {
    this.form.reset(
      Object.fromEntries(
        this.config.map((field) => [
          field.key,
          field.kind === 'boolean' ? false : '',
        ]),
      ),
      { emitEvent: false },
    );

    this.reset.emit();
  }

  private buildForm(): void {
    for (const field of this.config) {
      const control =
        field.kind === 'boolean'
          ? this.fb.nonNullable.control(false)
          : this.fb.control('');

      this.form.addControl(field.key, control);
    }
  }
}
