import { Module } from '@nestjs/common';
import { LoansService } from './loans.service.js';
import { LoansController } from './loans.controller.js';
import { AuthModule } from '../auth/auth.module.js';
import { LoansRepository } from './loans.repository.js';
import { SettingsModule } from '../settings/settings.module.js';

@Module({
  imports: [AuthModule, SettingsModule],
  controllers: [LoansController],
  providers: [LoansService, LoansRepository],
})
export class LoansModule {}
