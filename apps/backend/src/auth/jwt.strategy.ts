import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../prisma/prisma.service';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService) {
    super({
      // Extract JWT from both Authorization header AND httpOnly cookie
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        (request: Request) => {
          // Also check httpOnly cookie
          return request?.cookies?.access_token;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'your-secret-key-here',
    });
  }

  async validate(payload: any) {
    // Check if it's a customer or user token
    if (payload.type === 'customer') {
      // Verify customer still exists
      const customer = await this.prisma.customer.findUnique({
        where: { id: payload.sub },
        select: {
          id: true,
          email: true,
          name: true,
          status: true,
        },
      });

      if (!customer) {
        throw new UnauthorizedException('Customer tidak ditemukan atau telah dihapus');
      }

      if (customer.status !== 'active') {
        throw new UnauthorizedException('Akun customer tidak aktif');
      }

      // Return customer object that will be attached to request
      return {
        userId: payload.sub,
        sub: payload.sub,
        email: payload.email,
        name: customer.name,
        type: 'customer',
      };
    }

    // Default: Handle as regular user
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        tenantId: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('User tidak ditemukan atau telah dihapus');
    }

    // Return user object that will be attached to request
    return {
      userId: payload.sub,
      sub: payload.sub,
      email: payload.email,
      role: payload.role,
      name: user.name,
      tenantId: user.tenantId,
      type: 'user',
    };
  }
}
