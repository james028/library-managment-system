import { Component, computed } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from './core/auth/auth.service';

export interface HeaderItem {
  page: string;
  label: string;
  primary?: boolean;
}

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private readonly loggedOutHeaderItems: HeaderItem[] = [
    {
      page: '/login',
      label: 'Zaloguj się',
    },
    {
      page: '/register',
      label: 'Zarejestruj się',
      primary: true,
    },
  ];

  private readonly loggedInHeaderItems: HeaderItem[] = [
    {
      page: '/profile',
      label: 'Profil',
    },
  ];

  readonly headerItems = computed(() =>
    this.authService.user() ? this.loggedInHeaderItems : this.loggedOutHeaderItems,
  );

  constructor(public authService: AuthService) {}

  logout(): void {
    this.authService.logout();
  }
}
