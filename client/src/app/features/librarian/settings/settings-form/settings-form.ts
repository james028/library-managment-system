import {
  Component,
  EventEmitter,
  input,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { SettingsProps, SettingsSection } from '../settings';

@Component({
  selector: 'app-settings-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule],
  templateUrl: './settings-form.html',
  styleUrl: './settings-form.scss',
})
export class SettingsForm implements OnChanges {
  @Input() section!: SettingsSection;
  @Input() form!: FormGroup<Record<string, FormControl>>;
  @Input() groups: { name: SettingsSection; items: SettingsProps[] }[] = [];
  @Input() initialValues: Record<string, unknown> = {};
  readonly successMessage = input<string>();
  readonly errorMessage = input<string>();
  readonly saving = input<boolean>();

  @Output() saveClicked: EventEmitter<void> = new EventEmitter();
  @Output() sectionChange: EventEmitter<SettingsSection> = new EventEmitter();

  readonly meta: Record<string, { unit?: string; step?: number }> = {
    'fines.per_day_amount': { unit: 'PLN', step: 0.01 },
    'fines.max_per_item': { unit: 'PLN', step: 0.01 },
    'loans.default_period_days': { unit: 'dni' },
  };

  readonly groupLabels: Record<string, string> = {
    loans: 'Wypożyczenia',
    fines: 'Opłaty',
    holds: 'Rezerwacje',
    notifications: 'Powiadomienia',
    library: 'Biblioteka',
  };

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['activeGroup']) {
      console.log('Nowa wartość input:', changes['activeGroup'].currentValue);
      //console.log('Nowa wartość input:', changes['groups'].currentValue);
    }
  }

  getCtrl(key: string): FormControl {
    return this.form.controls[key] as FormControl;
  }
}
