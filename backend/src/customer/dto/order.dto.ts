import { IsEnum, IsNumber, IsOptional, IsString, Matches, ValidateNested } from 'class-validator';
import { AddressDto } from './address.dto';
import { Type } from 'class-transformer';

enum PaymentMethod {
  CASH = 'cash',
  CREDIT = 'credit-card',
  INTERAC = 'interac'
}

export class PlaceOrderDto {
  @IsOptional()
  @IsString()
  customerId?: string;

  @IsOptional()
  @IsString()
  guestEmail?: string;

  @IsOptional()
  @Matches(/^\+?[0-9]{7,14}$/)
  guestPhone?: string;

  @IsString()
  tiffinId!: string;

  @IsOptional()
  @IsString()
  planId?: string;

  @IsEnum(PaymentMethod)
  paymentMethod!: PaymentMethod;

  @IsNumber()
  total!: number;

  @IsOptional()
  @ValidateNested()
  @Type(() => AddressDto)
  deliveryAddress?: AddressDto;
}
