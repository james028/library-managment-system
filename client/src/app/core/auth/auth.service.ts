import { computed, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface AuthUser {
  id: string;
  email: string;
  role: 'member' | 'librarian';
  firstName: string;
  lastName: string;
}

interface LoginResponse {
  accessToken: string;
  user: AuthUser;
}

// providedIn: 'root' = singleton na całą aplikację, bez potrzeby importowania
// w żadnym module — odpowiednik jednego globalnego AuthContext w Reakcie.
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly _user = signal<AuthUser | null>(this.readStoredUser());
  readonly user = this._user.asReadonly();
  readonly isAuthenticated = computed(() => this._user() !== null);

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {}

  async login(email: string, password: string): Promise<void> {
    // firstValueFrom zamiast .subscribe() — zamienia Observable na Promise,
    // żeby dało się użyć await, tak jak przy axios w Reakcie. Wygodne w metodach typu login().
    const response = await firstValueFrom(
      this.http.post<LoginResponse>(`${environment.apiUrl}/auth/login`, { email, password }),
    );

    localStorage.setItem('accessToken', (response.accessToken));
    localStorage.setItem('user', JSON.stringify(response.user));
    this._user.set(response.user);
  }

  logout(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    this._user.set(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  private readStoredUser(): AuthUser | null {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  }
}
