import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // If no roles are required, allow access
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    if (!user || !user.role) {
      throw new ForbiddenException('Akses ditolak. Pengguna tidak memiliki role yang diizinkan');
    }

    // Check if user has any of the required roles
    const userRole = String(user.role).toUpperCase();
    const hasRole = requiredRoles.some((role) => userRole === role.toUpperCase());

    if (!hasRole) {
      console.warn('🚫 Role Access Denied:', {
        userRole: user.role,
        requiredRoles,
        userId: user.userId,
        email: user.email,
      });

      throw new ForbiddenException(
        `Akses ditolak. Role yang diperlukan: ${requiredRoles.join(', ')}. Role Anda: ${user.role}`,
      );
    }

    return true;
  }
}
