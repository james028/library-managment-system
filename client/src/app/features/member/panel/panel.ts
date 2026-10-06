import { Component, inject } from '@angular/core';
import { map, Observable, tap } from 'rxjs';
import { LoansService } from '../../../core/services/LoansService';
import { Fine, FinesService } from '../../../core/services/FinesService';
import { Reservation, ReservationsService } from '../../../core/services/ReservationsService';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { getReservationLabel } from '../reservations/model/reservation.model';

@Component({
  selector: 'app-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './panel.html',
  styleUrl: './panel.scss',
})
export class Panel {
  readonly messages$ = [{}, {}, {}];
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private loansService = inject(LoansService);
  private reservationsService = inject(ReservationsService);
  private finesService = inject(FinesService);

  protected readonly getLabel = getReservationLabel;

  readonly loans$ = this.loansService.getMyLoans().pipe(
    map((loans) => {
      return loans.map((loan) => {
        return {
          ...loan,
          isOverdue: loan.returned_at === null && new Date(loan.due_at) < new Date(),
        };
      });
    }),
  );

  readonly fines$: Observable<Fine[]> = this.finesService.getMyFines();

  readonly reservations$: Observable<Reservation[]> = this.reservationsService
    .getMyReservations()
    .pipe(
      tap((reservations) => console.log(reservations, "a")),
      map((reservations) => {
        const statuses = ['pending', 'fulfilled'];
        return reservations.filter(
          (res) => statuses.includes(res.status),
        );
      }),
    );

  switchTab(tab: string) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { section: tab },
      queryParamsHandling: 'merge',
    });
  }
}
