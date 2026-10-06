// reservation.model.ts
import { ReservationStatus} from '../../../../core/services/ReservationsService';

export enum ReservationStatusEnum {
  PENDING = 'pending',
  FULFILLED = 'fulfilled',
  CANCELLED = 'cancelled',
  READY = 'ready'
}

// Słownik tłumaczący statusy na język polski (przydatne w UI)
export const RESERVATION_STATUS_LABELS: Record<ReservationStatus, string> = {
  [ReservationStatusEnum.PENDING]: 'Oczekująca',
  [ReservationStatusEnum.FULFILLED]: 'Zrealizowana',
  [ReservationStatusEnum.CANCELLED]: 'Anulowana',
  [ReservationStatusEnum.READY]: 'Gotowa do odbioru'
};

export function getReservationLabel(status: string): string {
  return RESERVATION_STATUS_LABELS[status as ReservationStatus] ?? 'Nieznany status';
}
