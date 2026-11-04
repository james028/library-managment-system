import { Component, inject } from '@angular/core';
import { BreadcrumbService } from './breadcrumbs.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-breadcrumbs',
  imports: [RouterLink],
  templateUrl: './breadcrumbs.html',
  styleUrl: './breadcrumbs.scss',
})
export class Breadcrumbs {
  readonly breadcrumbService = inject(BreadcrumbService);
  readonly breadCrumbs = this.breadcrumbService.breadcrumbs();
}
