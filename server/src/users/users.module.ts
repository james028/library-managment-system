import { Module } from '@nestjs/common';
import { UsersRepository } from './users.repository.js';

@Module({
  providers: [UsersRepository],
  exports: [UsersRepository], // eksportujemy, żeby auth.module.ts mógł go zaimportować
})
export class UsersModule {}
