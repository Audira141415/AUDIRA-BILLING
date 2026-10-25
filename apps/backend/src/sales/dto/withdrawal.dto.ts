import { IsString, IsNotEmpty, IsNumber, Min, IsOptional } from 'class-validator';

export class RequestWithdrawalDto {
  @IsNumber()
  @Min(50000, { message: 'Minimal penarikan saldo adalah Rp 50.000' })
  amount: number;

  @IsString()
  @IsNotEmpty({ message: 'Nama Bank atau E-Wallet wajib diisi' })
  bankName: string;

  @IsString()
  @IsNotEmpty({ message: 'Nomor rekening atau HP E-Wallet wajib diisi' })
  bankAccount: string;

  @IsString()
  @IsNotEmpty({ message: 'Nama pemilik rekening wajib diisi' })
  bankAccountName: string;
}

export class ApproveWithdrawalDto {
  @IsString()
  @IsOptional()
  transferReceipt?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}

export class RejectWithdrawalDto {
  @IsString()
  @IsNotEmpty({ message: 'Alasan penolakan wajib dicantumkan' })
  reason: string;
}
