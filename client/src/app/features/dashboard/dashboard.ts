import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MyLoans } from '../member/my-loans/my-loans';

type ActiveTab =
  'catalog' | 'loans' | 'fines' | 'reservations' | 'personal data' | 'messages' | 'review';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MyLoans],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  activeTab: ActiveTab = 'catalog';
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const section = params['section'];

      if (section) {
        this.activeTab = section;
      } else {
        this.switchTab(section);
      }
    });
  }

  switchTab(tab: ActiveTab = 'catalog', updateUrl: boolean = true) {
    this.activeTab = tab;

    if (updateUrl) {
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { section: tab, lang: 'PL' },
        queryParamsHandling: 'merge', // zachowuje inne parametry w URL, jeśli by były
      });
    }
  }
}
