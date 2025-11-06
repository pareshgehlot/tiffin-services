import { IsOptional, IsString, MinLength } from 'class-validator';

export class AddressDto {
  @IsString()
  @MinLength(3)
  label!: string;

  @IsString()
  @MinLength(5)
  street!: string;

  @IsString()
  @MinLength(2)
  city!: string;

  @IsString()
  @MinLength(3)
  postalCode!: string;

  @IsOptional()
  @IsString()
  instructions?: string;
}
