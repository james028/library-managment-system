import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './layout.html',
})
export class Layout {
  // Publiczne pole, bo szablon HTML potrzebuje bezpośredniego dostępu do authService.user()
  // (w Angularze, inaczej niż w Reakcie, komponent i jego szablon to jedna "klasa" —
  // nie przekazujesz propsów, tylko eksponujesz to, czego szablon potrzebuje, jako pola/gettery).
  constructor(public authService: AuthService) {}

  logout(): void {
    this.authService.logout();
  }
}
