import { Component } from '@angular/core';
import { CommonModule, NgComponentOutlet } from '@angular/common';
import { BaseDashboardComponent } from '../basedashboard/basedashboard';
import { MEMBER_TABS } from '../dashboard.config';

@Component({
  selector: 'app-member-dashboard',
  standalone: true,
  imports: [
    CommonModule,      // Dostarcza dyrektywy strukturalne (np. @for, @if jeśli byłyby w HTML)
    NgComponentOutlet  // KLUCZOWE: Wymagane do dynamicznego renderowania komponentów przez *ngComponentOutlet
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class MemberDashboard extends BaseDashboardComponent {
  override tabs = MEMBER_TABS;
}
