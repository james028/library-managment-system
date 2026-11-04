import { Component, inject, OnInit, signal } from '@angular/core';
import { SettingsForm } from './settings-form/settings-form';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SettingsService } from '../../../core/services/SettingsService';
import { Breadcrumbs } from '../../../shared/ui/breadcrumbs/breadcrumbs';

export type SettingsSection =
  'loans' | 'fines' | 'holds' | 'notifications' | 'patrons' | 'library' | '';

export interface SettingsProps {
  key: string;
  value: string;
  type: 'int' | 'decimal' | 'bool' | 'string';
  description?: string;
}

@Component({
  selector: 'app-settings',
  imports: [CommonModule, SettingsForm, Breadcrumbs],
  templateUrl: './settings.html',
  styleUrl: './settings.scss',
})
export class Settings implements OnInit {
  activeSection: SettingsSection | null = null;
  form = new FormGroup<Record<string, FormControl>>({});
  groups: { name: SettingsSection; items: SettingsProps[] }[] = [];
  settingsService = inject(SettingsService);
  initial: Record<string, unknown> = {};
  saving = signal(false);
  loading = signal(true);
  successMessage = signal('');
  errorMessage = signal('');
  errorDataMessage = signal('');

  setSection(section: SettingsSection): void {
    this.activeSection = section;
  }

  ngOnInit() {
    this.load();
  }

  load() {
    this.loading.set(true);
    this.errorDataMessage.set('');

    this.settingsService.getSettings().subscribe({
      next: (settings) => {
        settings.forEach((s) => {
          const v = this.parse(s);
          this.form.addControl(s.key, new FormControl(v, this.validatorsFor(s)));
        });
        this.initial = this.form.getRawValue();
        this.form.markAsPristine();
        this.buildGroups(settings);

        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.errorDataMessage.set('Wystąpiły błędy przy pobieraniu danych');
      },
    });
  }

  save() {
    if (this.form.invalid) return;

    const changes: Record<string, string> = {};
    Object.entries(this.form.controls).forEach(([key, ctrl]) => {
      if (ctrl.dirty && ctrl.value !== this.initial[key]) {
        changes[key] = String(ctrl.value);
      }
    });

    if (!Object.keys(changes).length) return;

    this.saving.set(true);
    this.successMessage.set('');
    this.errorMessage.set('');
    this.clearServerErrors();

    this.settingsService.updateSettings(changes).subscribe({
      next: () => {
        this.initial = this.form.getRawValue();
        this.form.markAsPristine();
        this.saving.set(false);
        this.successMessage.set('Ustawienia zostały zapisane.');
      },
      error: (e: { error: { errors: Record<string, string> | undefined } }) => {
        this.saving.set(false);
        this.applyServerErrors(e.error?.errors);
      },
    });
  }

  private applyServerErrors(errors?: Record<string, string>) {
    if (!errors || !Object.keys(errors).length) {
      this.successMessage.set('Nie udało się zapisać ustawień.');
      return;
    }

    Object.entries(errors).forEach(([key, message]) => {
      const control = this.form.get(key);

      if (control) {
        control.setErrors({ server: message });
      } else {
        this.errorMessage.set(message);
      }
    });
  }

  private clearServerErrors() {
    Object.values(this.form.controls).forEach((control) => {
      if (control.errors?.['server']) {
        control.setErrors(null);
      }
    });
  }

  private parse(s: SettingsProps) {
    switch (s.type) {
      case 'int':
        return parseInt(s.value, 10);
      case 'decimal':
        return parseFloat(s.value);
      case 'bool':
        return s.value === 'true';
      default:
        return s.value;
    }
  }

  private validatorsFor(s: SettingsProps) {
    if (s.type === 'int' || s.type === 'decimal') {
      return [Validators.required, Validators.min(0)];
    }

    return [];
  }

  private buildGroups(list: SettingsProps[]) {
    const map = new Map<any, SettingsProps[]>();
    list.forEach((l) => {
      const prefix = l.key.split('.')[0];
      map.set(prefix, [...(map.get(prefix) ?? []), l]);
    });

    this.groups = [...map].map(([name, items]) => {
      return {
        name: name as SettingsSection,
        items,
      };
    });
  }
}
