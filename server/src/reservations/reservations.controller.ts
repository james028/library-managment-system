import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import type { CurrentUserPayload } from '../common/decorators/current-user.decorator.js';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guards.js';
import { CreateReservationDto } from './dto/create-reservation.dto.js';
import { ReservationsService } from './reservations.service.js';

@Controller('reservations')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  // Brak @Roles() — member rezerwuje dla siebie, ale librarian technicznie też mógłby
  // (np. rezerwacja telefoniczna, robiona przez pracownika w imieniu klienta — zostawiamy otwarte).

  @Post()
  @ApiOperation({
    summary: 'Create book reservations',
    description: 'user can reserves a book',
  })
  create(
    @Body() dto: CreateReservationDto,
    @CurrentUser() user: CurrentUserPayload,
  ) {
    return this.reservationsService.create(user.userId, dto);
  }

  @Get('me')
  @ApiOperation({
    summary: 'Find book reservations by users',
    description: 'list all reservations by user',
  })
  findMyReservations(@CurrentUser() user: CurrentUserPayload) {
    return this.reservationsService.findMyReservations(user.userId);
  }

  // Brak @Roles() celowo — dostęp reguluje logika WEWNĄTRZ service (ownership check),
  // nie sam guard. Guard sprawdza tylko "czy jesteś zalogowany", resztę robi serwis.
  @Patch(':id/cancel')
  @ApiOperation({
    summary: 'Cancel reservation',
    description: 'cancel reservation by book id',
  })
  cancel(@Param('id') id: string, @CurrentUser() user: CurrentUserPayload) {
    return this.reservationsService.cancel(id, user);
  }

  @Patch(':id/fulfill')
  @Roles('librarian')
  @ApiOperation({
    summary: 'Fulfill reservation',
    description: 'fulfill reservation by book id',
  })
  fulfill(@Param('id') id: string) {
    return this.reservationsService.fulfill(id);
  }
}
