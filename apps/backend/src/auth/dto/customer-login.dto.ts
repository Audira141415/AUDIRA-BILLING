import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CustomerLoginDto {
  @IsNotEmpty({ message: 'Email tidak boleh kosong' })
  @IsEmail({}, { message: 'Format email tidak valid' })
  @IsString({ message: 'Email harus berupa string' })
  email: string;

  @IsNotEmpty({ message: 'Password tidak boleh kosong' })
  @IsString({ message: 'Password harus berupa string' })
  @MinLength(3, { message: 'Password minimal 3 karakter' })
  password: string;
}
