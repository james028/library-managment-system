import { Module } from '@nestjs/common';
import { FinesController } from './fines.controller.js';
import { FinesService } from './fines.service.js';
import { FinesRepository } from './fines.repository.js';
import { AuthModule } from '../auth/auth.module.js';

@Module({
  imports: [AuthModule],
  controllers: [FinesController],
  providers: [FinesService, FinesRepository],
})
export class FinesModule {}