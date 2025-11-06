import { IsIn, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateOrderStatusDto {
  @IsString()
  id!: string;

  @IsIn(['pending', 'preparing', 'ready', 'out-for-delivery', 'completed', 'cancelled'])
  status!: 'pending' | 'preparing' | 'ready' | 'out-for-delivery' | 'completed' | 'cancelled';

  @IsOptional()
  @IsNumber()
  total?: number;
}

export class UpdateDeliveryStatusDto {
  @IsString()
  id!: string;

  @IsIn(['scheduled', 'enroute', 'delivered'])
  status!: 'scheduled' | 'enroute' | 'delivered';

  @IsOptional()
  @IsString()
  deliveredAt?: string;

  @IsOptional()
  @IsString()
  driverId?: string;
}
