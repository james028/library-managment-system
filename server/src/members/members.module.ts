import { Module } from '@nestjs/common';
import { MembersController } from './members.controller.js';
import { MembersService } from './members.service.js';
import { MembersRepository } from './members.repository.js';
import { AuthModule } from '../auth/auth.module.js';

@Module({
  imports: [AuthModule],
  controllers: [MembersController],
  providers: [MembersService, MembersRepository]
})
export class MembersModule {}
