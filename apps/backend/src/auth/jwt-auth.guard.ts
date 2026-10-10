import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    // Add custom authentication logic here if needed
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    // You can throw an exception based on either "info" or "err" arguments
    if (err || !user) {
      const request = context.switchToHttp().getRequest();
      const token = request.headers.authorization;

      console.error('🚫 JWT Authentication Failed:', {
        error: err?.message,
        info: info?.message,
        hasToken: !!token,
        path: request.url,
        method: request.method,
      });

      throw err || new UnauthorizedException('Token tidak valid atau expired. Silakan login kembali.');
    }
    
    return user;
  }
}
