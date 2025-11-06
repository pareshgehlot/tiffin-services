import { IsIn, IsOptional, IsString } from 'class-validator';

export class DriverUpdateDeliveryDto {
  @IsString()
  id!: string;

  @IsIn(['scheduled', 'enroute', 'delivered'])
  status!: 'scheduled' | 'enroute' | 'delivered';

  @IsOptional()
  @IsString()
  deliveredAt?: string;
}
