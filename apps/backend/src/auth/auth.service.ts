import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService, AuditAction } from '../audit/audit.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private auditService: AuditService,
  ) {}

  async register(data: any) {
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await this.prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        password: hashedPassword,
        role: data.role || 'BILLING', // Default to BILLING if not specified
      },
    });

    const { password, ...result } = user;
    return {
      message: 'Registrasi berhasil',
      user: result,
    };
  }

  async login(data: any, ipAddress?: string, userAgent?: string) {
    const user = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      // Log failed login attempt
      await this.auditService.log({
        action: AuditAction.LOGIN_FAILED,
        userEmail: data.email,
        details: { reason: 'User not found' },
        ipAddress,
        userAgent,
        status: 'FAILED',
        errorMessage: 'Email atau password salah',
      });
      throw new UnauthorizedException('Email atau password salah');
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password);

    if (!isPasswordValid) {
      // Log failed login attempt
      await this.auditService.log({
        action: AuditAction.LOGIN_FAILED,
        userEmail: user.email,
        details: { reason: 'Invalid password' },
        ipAddress,
        userAgent,
        status: 'FAILED',
        errorMessage: 'Email atau password salah',
      });
      throw new UnauthorizedException('Email atau password salah');
    }

    const payload = { email: user.email, sub: user.id, role: user.role };
    const token = this.jwtService.sign(payload);

    const { password, ...result } = user;

    // Log successful login
    await this.auditService.log({
      action: AuditAction.LOGIN,
      userEmail: user.email,
      details: { role: user.role },
      ipAddress,
      userAgent,
      status: 'SUCCESS',
    });

    return {
      message: 'Login berhasil',
      access_token: token,
      user: result,
    };
  }
}
