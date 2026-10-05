// base-dashboard.component.ts
import { Directive, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ActiveTab, TabConfig } from '../dashboard.config';

@Directive() // Klasa bazowa, po której dziedziczą konkretne panele
export abstract class BaseDashboardComponent implements OnInit {
  protected route = inject(ActivatedRoute);
  protected router = inject(Router);

  activeTab: ActiveTab = 'panel';
  abstract tabs: TabConfig[];

  ngOnInit(): void {
    // Nasłuchiwanie parametrów z URL (np. /member/dashboard?section=loans)
    this.route.queryParams.subscribe((params) => {
      const section = params['section'] as ActiveTab;

      // Sprawdzamy czy żądana zakładka istnieje w konfiguracji danej roli
      const isValidTab = this.tabs.some(tab => tab.id === section);

      if (isValidTab) {
        this.activeTab = section;
      } else {
        // Jeśli brak lub nieznana, ustawiamy domyślną pierwszą zakładkę
        this.switchTab(this.tabs[0].id, false);
      }
    });
  }

  switchTab(tab: ActiveTab, updateUrl: boolean = true) {
    this.activeTab = tab;

    if (updateUrl) {
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { section: tab },
        queryParamsHandling: 'merge',
      });
    }
  }

  // Pomocnicza metoda zwracająca komponent aktualnie wybranej zakładki
  get activeComponent() {
    const current = this.tabs.find(t => t.id === this.activeTab);
    return current ? current.component : this.tabs[0].component;
  }
}
