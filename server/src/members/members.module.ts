import { Module } from '@nestjs/common';
import { MembersController } from './members.controller.js';
import { MembersService } from './members.service.js';
import { MembersRepository } from './members.repository.js';
import { AuthModule } from '../auth/auth.module.js';
import { UsersRepository } from '../users/users.repository.js';

@Module({
  imports: [AuthModule],
  controllers: [MembersController],
  providers: [MembersService, MembersRepository, UsersRepository],
})
export class MembersModule {}
