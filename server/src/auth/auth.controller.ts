import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';

import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { AuthService } from './auth.service.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    console.log(dto);
    return this.authService.register(dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK) // domyślnie POST zwraca 201, a logowanie semantycznie to 200
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }
}