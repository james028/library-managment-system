import { Component, inject } from '@angular/core';
import {
  catchError,
  map,
  Observable,
  of,
  shareReplay,
  startWith,
  Subject,
  switchMap,
  tap,
} from 'rxjs';
import { Reservation, ReservationsService } from '../../../core/services/ReservationsService';
import { AsyncPipe, CommonModule } from '@angular/common';
import { getReservationLabel, ReservationStatusEnum } from './model/reservation.model';

@Component({
  selector: 'app-reservations',
  imports: [AsyncPipe, CommonModule],
  templateUrl: './reservations.html',
  styleUrl: './reservations.scss',
})
export class Reservations {
  readonly reservationsStatus = ReservationStatusEnum;
  loadingIds = new Set<string>();
  protected readonly getLabel = getReservationLabel;
  // Wyzwalacz odświeżania listy po akcji PATCH
  private readonly refreshTrigger$ = new Subject<void>();

  private reservationsService = inject(ReservationsService);

  readonly reservations$: Observable<Reservation[]> = this.refreshTrigger$.pipe(
    startWith(void 0),
    switchMap(() =>
      this.reservationsService.getMyReservations().pipe(
        tap((l) => console.log(l)),
        map((reservations) => {
          return reservations.map((reservation) => {
            return {
              ...reservation,
            };
          });
        }),
        catchError((err) => {
          console.error('Nie udało się pobrać rezerwacji', err);
          return of([]); // Zwracamy pustą tablicę, żeby strumień nie uległ awarii
        }),
      ),
    ),
    shareReplay(1),
  );

  cancelReservation(id: string) {
    this.loadingIds.add(id);

    this.reservationsService.cancelMyReservations(id).subscribe({
      next: () => {
        console.log('Rezerwacja anulowana pomyślnie');
        this.refreshTrigger$.next();
        this.loadingIds.delete(id);
      },
      error: (error) => {
        console.error('Błąd podczas anulowania rezerwacji', error);
        this.loadingIds.delete(id);
      },
    });
  }
}
