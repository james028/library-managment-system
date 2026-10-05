import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
})
export class LoginComponent {
  readonly errorMessage = signal<string | null>(null);
  readonly isSubmitting = signal(false);
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      //password: ['', Validators.required, Validators.minLength(6)],
      password: [''],
    });
  }

  get email() {
    return this.form.get('email');
  }

  get password() {
    return this.form.get('password');
  }

  async onSubmit(): Promise<void> {
    if (this.form.invalid) return;

    this.isSubmitting.set(true);
    this.errorMessage.set(null);

    try {
      const { email, password } = this.form.getRawValue();
      await this.authService.login(email!, password!);

      // Po zalogowaniu kierujemy wg roli — odpowiednik tego, co dawniej robiłby
      // sam ProtectedRoute w Reakcie po pierwszym wejściu na "/".
      const user = this.authService.user();
      this.router.navigate([user?.role === 'librarian' ? '/admin/dashboard' : '/app/dashboard']);
    } catch (error: any) {
      this.errorMessage.set(error.error?.message ?? 'Nieprawidłowy email lub hasło');
    } finally {
      this.isSubmitting.set(false);
    }
  }
}
