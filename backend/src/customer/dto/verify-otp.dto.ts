import { IsString, Matches } from 'class-validator';

export class VerifyOtpDto {
  @IsString()
  @Matches(/^\+?[0-9]{7,14}$/)
  phone!: string;

  @IsString()
  @Matches(/^[0-9]{6}$/)
  code!: string;
}
