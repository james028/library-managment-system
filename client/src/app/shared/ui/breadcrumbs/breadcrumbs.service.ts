import { ActivatedRouteSnapshot, NavigationEnd, Router } from '@angular/router';
import { inject, Injectable, signal } from '@angular/core';
import { filter } from 'rxjs';

export interface Breadcrumb {
  label: string;
  url: string;
}

export const ADMIN_SECTION_LABELS: Record<string, string> = {
  'manage-loans': 'Zarządzanie wypożyczeniami',
  'manage-books': 'Zarządzanie książkami',
  members: 'Zarządzanie członkami',
  settings: 'Ustawienia',
};

@Injectable({ providedIn: 'root' })
export class BreadcrumbService {
  readonly breadcrumbs = signal<Breadcrumb[]>([]);
  private readonly router = inject(Router);

  constructor() {
    this.update();

    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe(() => this.update());
  }

  private update(): void {
    const root = this.router.routerState.snapshot.root;

    const routeBreadcrumbs = this.buildFromRoutes(root.firstChild, []);
    const sectionBreadcrumb = this.buildFromQueryParams(root);

    this.breadcrumbs.set([...routeBreadcrumbs, ...sectionBreadcrumb]);
  }

  private buildFromRoutes(route: ActivatedRouteSnapshot | null, parentUrl: string[]): Breadcrumb[] {
    if (!route) {
      return [];
    }

    const currentUrl = [...parentUrl, ...route.url.map((segment) => segment.path)];

    const label = route.data['breadcrumb'];

    const current: Breadcrumb[] = label
      ? [
          {
            label,
            url: '/' + currentUrl.join('/'),
          },
        ]
      : [];

    return [...current, ...this.buildFromRoutes(route.firstChild, currentUrl)];
  }

  private buildFromQueryParams(route: ActivatedRouteSnapshot | null): Breadcrumb[] {
    const section = route?.queryParamMap.get('section');

    if (!section) {
      return [];
    }

    const label = ADMIN_SECTION_LABELS[section];

    if (!label) {
      return [];
    }

    return [
      {
        label,
        url: this.router.url,
      },
    ];
  }
}
