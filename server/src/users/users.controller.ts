import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guards.js';
import type { CurrentUserPayload } from '../common/decorators/current-user.decorator.js';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';
import { UsersService } from './users.service.js';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@Controller('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @ApiOperation({
    summary: 'Get user data',
    description: 'all data of register user',
  })
  getMe(@CurrentUser() user: CurrentUserPayload) {
    return this.usersService.findOne(user.userId);
  }
}
