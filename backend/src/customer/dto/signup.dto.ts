import { IsEmail, IsOptional, IsString, Matches, MinLength } from 'class-validator';

export class SignUpDto {
  @IsString()
  @MinLength(2)
  name!: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @Matches(/^\+?[0-9]{7,14}$/)
  phone?: string;

  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;
}
