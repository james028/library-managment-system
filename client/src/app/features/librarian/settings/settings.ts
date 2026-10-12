import { Component, inject, OnInit } from '@angular/core';
import { SettingsForm } from './settings-form/settings-form';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SettingsService } from '../../../core/services/SettingsService';

type SettingsSection = 'loans' | 'fines' | 'holds' | 'notifications' | 'patrons' | 'library' | '';

export interface Setting {
  key: string;
  value: string;
  type: 'int' | 'decimal' | 'bool' | 'string';
  description?: string;
}

@Component({
  selector: 'app-settings',
  imports: [CommonModule, SettingsForm],
  templateUrl: './settings.html',
  styleUrl: './settings.scss',
})
export class Settings implements OnInit {
  activeSection: SettingsSection = '';
  form = new FormGroup<Record<string, FormControl>>({});
  groups: { name: string; items: Settings[] }[] = [];
  settingsService = inject(SettingsService);
  initial: Record<string, unknown> = {};

  setSection(section: SettingsSection): void {
    this.activeSection = section;
  }

  ngOnInit() {
    this.load();
  }

  load() {
    this.settingsService.getSettings().subscribe((settings) => {
      settings.forEach((s: any) => {
        const v = this.parse(s);
        this.form.addControl(s.key, new FormControl(v, this.validatorsFor(s)));
      });
      this.initial = this.form.getRawValue();
      this.form.markAsPristine();
      this.buildGroups(settings);
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

    this.settingsService.updateSettings(changes).subscribe(() => {
      this.initial = this.form.getRawValue();
      this.form.markAsPristine();
    });
  }

  private parse(s: Setting) {
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

  private validatorsFor(s: Setting) {
    return s.type === 'int' || s.type === 'decimal'
      ? [Validators.required, Validators.min(0)]
      : [Validators.required];
  }

  private buildGroups(list: Setting[]) {
    const map = new Map<string, Settings[]>();
    list.forEach((l) => {
      const prefix = l.key.split('.')[0];
      // @ts-ignore
      map.set(prefix, [...(map.get(prefix) ?? []), l]);
    });

    this.groups = [...map].map(([name, items]) => {
      return {
        name,
        items: items,
      };
    });
  }
}
