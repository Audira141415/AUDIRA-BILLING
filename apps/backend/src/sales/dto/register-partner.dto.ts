import { IsString, IsNotEmpty, IsOptional, IsEmail, MinLength } from 'class-validator';

export class RegisterPartnerDto {
  @IsString()
  @IsNotEmpty({ message: 'Nama lengkap wajib diisi' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'Nomor WhatsApp wajib diisi' })
  phone: string;

  @IsEmail({}, { message: 'Format email tidak valid' })
  @IsOptional()
  email?: string;

  @IsString()
  @MinLength(6, { message: 'Kata sandi minimal 6 karakter' })
  password: string;

  @IsString()
  @IsOptional()
  zone?: string;

  @IsString()
  @IsOptional()
  bio?: string;

  @IsString()
  @IsOptional()
  bankName?: string;

  @IsString()
  @IsOptional()
  bankAccount?: string;

  @IsString()
  @IsOptional()
  bankAccountName?: string;
}
