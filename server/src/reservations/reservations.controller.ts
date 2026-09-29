import { Body, Controller, UseGuards, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';
import type { CurrentUserPayload } from '../common/decorators/current-user.decorator.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guards.js';
import { CreateReservationDto } from './dto/create-reservation.dto.js';
import { ReservationsService } from './reservations.service.js';
import { Roles } from '../auth/decorators/roles.decorator.js';

@Controller('reservations')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
export class ReservationsController {

  constructor(private readonly reservationsService: ReservationsService) {}
  // Brak @Roles() — member rezerwuje dla siebie, ale librarian technicznie też mógłby
  // (np. rezerwacja telefoniczna, robiona przez pracownika w imieniu klienta — zostawiamy otwarte).

  @Post()
  @Roles('member')
  @ApiOperation({
    summary: 'Create book reservations',
    description: 'user can reserves a book',
  })
  create(@Body() dto: CreateReservationDto, @CurrentUser() user: CurrentUserPayload) {
    return this.reservationsService.create(user.userId, dto);
  }
}

