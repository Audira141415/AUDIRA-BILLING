import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CustomerLoginDto {
  @IsNotEmpty({ message: 'Email atau ID Pelanggan tidak boleh kosong' })
  @IsString({ message: 'Email atau ID Pelanggan harus berupa string' })
  email: string;

  @IsNotEmpty({ message: 'Password tidak boleh kosong' })
  @IsString({ message: 'Password harus berupa string' })
  @MinLength(3, { message: 'Password minimal 3 karakter' })
  password: string;
}
