import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guards.js';
import type { CurrentUserPayload } from '../common/decorators/current-user.decorator.js';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';
import { FinesService } from './fines.service.js';


@Controller('fines')
// @UseGuards(JwtAuthGuard, RolesGuard)
export class FinesController {
  constructor(private readonly finesService: FinesService) {}

  @Get('me') findMyFines(@CurrentUser() user: CurrentUserPayload) {
    return this.finesService.findMyFines("1b5c7860-de7a-47fa-a01d-05df92862e69");
  }
}
