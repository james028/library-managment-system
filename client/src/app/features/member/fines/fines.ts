import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, map } from 'rxjs';
import { FinesService, Fine } from '../../../core/services/FinesService.js';

@Component({
  selector: 'app-fines',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './fines.html',
  styleUrl: './fines.scss',
})
export class Fines {
  private finesService = inject(FinesService);


  readonly fines$: Observable<Fine[]> = this.finesService.getMyFines();
  readonly finesCount$: Observable<number> = this.finesService.getMyFines().pipe(
    map(data => data.length)
  )

  constructor() {
    this.finesCount$.subscribe(l => {
      console.log(l, "ll");
    });
  }
}
