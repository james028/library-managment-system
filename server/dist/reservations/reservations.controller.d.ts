import type { CurrentUserPayload } from '../common/decorators/current-user.decorator.js';
import { CreateReservationDto } from './dto/create-reservation.dto.js';
import { ReservationsService } from './reservations.service.js';
export declare class ReservationsController {
    private readonly reservationsService;
    constructor(reservationsService: ReservationsService);
    create(dto: CreateReservationDto, user: CurrentUserPayload): Promise<import("./reservations.repository.js").ReservationRecord>;
}
