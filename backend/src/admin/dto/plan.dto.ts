import { IsArray, IsEnum, IsNumber, IsOptional, IsString, Min, MinLength } from 'class-validator';

enum BillingCycle {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly'
}

export class UpsertPlanDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsString()
  @MinLength(3)
  name!: string;

  @IsEnum(BillingCycle)
  billingCycle!: BillingCycle;

  @IsNumber()
  @Min(0)
  price!: number;

  @IsString()
  @MinLength(10)
  description!: string;

  @IsArray()
  @IsString({ each: true })
  perks!: string[];
}
