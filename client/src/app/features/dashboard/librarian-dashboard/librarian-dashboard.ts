import { Component } from '@angular/core';
import { CommonModule, NgComponentOutlet } from '@angular/common';
import { BaseDashboardComponent } from '../basedashboard/basedashboard';
import { LIBRARIAN_TABS } from '../dashboard.config';

@Component({
  selector: 'app-librarian-dashboard',
  standalone: true,
  imports: [
    CommonModule,      // Dostarcza dyrektywy strukturalne (np. @for, @if jeśli byłyby w HTML)
    NgComponentOutlet  // KLUCZOWE: Wymagane do dynamicznego renderowania komponentów przez *ngComponentOutlet
  ],
  templateUrl: './librarian-dashboard.html',
  styleUrl: './librarian-dashboard.scss',
})
export class LibrarianDashboard extends BaseDashboardComponent {
  override tabs = LIBRARIAN_TABS;
}
