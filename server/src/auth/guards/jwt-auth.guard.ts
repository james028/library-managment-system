

// 'jwt' odnosi się do nazwy strategii zarejestrowanej przez PassportStrategy w JwtStrategy
import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    console.log('Authorization:', request.headers.authorization);

    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any) {
    console.log('JWT error:', err);
    console.log('JWT user:', user);
    console.log('JWT info:', info);

    return super.handleRequest(err, user, info, info);
  }
}