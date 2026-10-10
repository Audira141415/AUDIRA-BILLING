import { Controller, Post, Body, UnauthorizedException, HttpCode, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { CustomerLoginDto } from './dto/customer-login.dto';

@Controller('auth/customer')
export class CustomerAuthController {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.CREATED)
  async customerLogin(@Body() loginDto: CustomerLoginDto) {
    // Find customer by email
    const customer = await this.prisma.customer.findUnique({
      where: { email: loginDto.email },
      include: {
        packages: true,
      },
    });

    if (!customer) {
      throw new UnauthorizedException('Email atau password salah');
    }

    // Check if customer has password
    if (!customer.password) {
      throw new UnauthorizedException('Akun belum memiliki password. Silakan hubungi admin.');
    }
    
    // Verify password
    const isPasswordValid = await bcrypt.compare(loginDto.password, customer.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Email atau password salah');
    }

    // Generate JWT token
    const payload = { 
      email: customer.email, 
      sub: customer.id, 
      type: 'customer',
      name: customer.name 
    };
    const token = this.jwtService.sign(payload);

    // Remove password from response
    const { password, ...result } = customer;

    return {
      message: 'Login berhasil',
      access_token: token,
      customer: result,
    };
  }
}
