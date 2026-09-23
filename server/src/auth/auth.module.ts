import { UsersModule } from '../users/users.module.js';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';
import { JwtStrategy } from './strategies/jwt-strategy.js';
import { JwtAuthGuard } from './guards/jwt-auth.guard.js'; // <-- Dodaj import swojego guarda (dopasuj ścieżkę)
import { Module } from '@nestjs/common';

@Module({
  imports: [
    UsersModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1d' },
      }),
    }),
  ],

  controllers: [AuthController],

  providers: [
    AuthService,
    JwtStrategy,
    JwtAuthGuard, // <-- 1. Musi być tutaj, żeby moduł wiedział, jak go zbudować
  ],

  exports: [
    JwtModule,
    PassportModule,
    JwtAuthGuard, // <-- 2. Musisz go wyeksportować, żeby inne moduły mogły z niego korzystać!
  ],
})
export class AuthModule {}