import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// 'jwt' odnosi się do nazwy strategii zarejestrowanej przez PassportStrategy w JwtStrategy
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}