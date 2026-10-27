import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  inject,
} from '@angular/core';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Member, MemberEditValue } from '../interfaces/members.interface';

@Component({
  selector: 'app-member-edit',
  standalone: true,
  imports: [ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './member-edit.html',
  styleUrl: './member-edit.scss',
})
export class MemberEdit implements OnChanges {
  @Input({ required: true }) member!: Member;
  @Input() saving = false;
  @Input() error: string | null = null;

  @Output() readonly save = new EventEmitter<Partial<MemberEditValue>>();
  @Output() readonly cancel = new EventEmitter<void>();

  private readonly fb = inject(NonNullableFormBuilder);

  readonly statusOptions = [
    { value: 'ACTIVE', label: 'Aktywny' },
    { value: 'BLOCKED', label: 'Zablokowany' },
  ];

  readonly form = this.fb.group({
    firstName: ['', [Validators.required, Validators.maxLength(100)]],
    lastName: ['', [Validators.required, Validators.maxLength(100)]],
    email: ['', [Validators.required, Validators.email]],
    status: ['', Validators.required],
  });

  private initialValue!: MemberEditValue;


  ngOnChanges(changes: SimpleChanges): void {
    if (changes['member'] && this.member) {
      const value: MemberEditValue = {
        firstName: this.member.firstName,
        lastName: this.member.lastName,
        email: this.member.email,
        status: this.member.status,
      };

      this.initialValue = value;
      this.form.reset(value);
    }
  }

  showError(name: keyof typeof this.form.controls): boolean {
    const control = this.form.controls[name];
    return control.invalid && (control.dirty || control.touched);
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const patch = this.buildPatch();

    if (Object.keys(patch).length === 0) {
      this.cancel.emit();
      return;
    }

    this.save.emit(patch);
  }

  private buildPatch(): Partial<MemberEditValue> {
    const currentValue = this.form.getRawValue();
    const patch: Partial<MemberEditValue> = {};

    for (const key of Object.keys(currentValue) as (keyof MemberEditValue)[]) {
      if (currentValue[key] !== this.initialValue[key]) {
        patch[key] = currentValue[key];
      }
    }

    return patch;
  }

  get hasChanges(): boolean {
    return Object.keys(this.buildPatch()).length > 0;
  }
}
