import { Controller, Get, Query, UseGuards, Body, Patch } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guards.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { SettingsService } from './settings.service.js';
import { GetSettingsQueryDto } from './dto/settings-query.dto.js';
import { CurrentUser, type CurrentUserPayload } from '../common/decorators/current-user.decorator.js';

@Controller('settings')
@ApiTags('Settings')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('librarian')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all settings',
    description: 'Returns list of all settings or by specific keys',
  })
  getAll(@Query() query: GetSettingsQueryDto) {
      return !query?.keys?.length
        ? this.settingsService.getSettings()
        : this.settingsService.findByKeys(query?.keys);
  }

  @Patch()
  update(@Body() body: Record<string, string>,  @CurrentUser() user: CurrentUserPayload) {
    return this.settingsService.update(body, user.userId);
  }
}
