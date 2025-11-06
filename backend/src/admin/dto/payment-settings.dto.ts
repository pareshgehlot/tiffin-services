import { IsBoolean, IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdatePaymentSettingsDto {
  @IsOptional()
  @IsBoolean()
  allowCashOnDelivery?: boolean;

  @IsOptional()
  @IsBoolean()
  allowCreditCard?: boolean;

  @IsOptional()
  @IsBoolean()
  allowInterac?: boolean;

  @IsOptional()
  @IsString()
  creditCardProcessor?: string;

  @IsOptional()
  @IsString()
  processorPublicKey?: string;

  @IsOptional()
  @IsString()
  processorSecretKey?: string;

  @IsOptional()
  @IsEmail()
  interacRecipientEmail?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
