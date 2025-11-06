import { IsOptional, IsString, MinLength } from 'class-validator';

export class CustomerLoginDto {
  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsString()
  @MinLength(6)
  password!: string;
}
