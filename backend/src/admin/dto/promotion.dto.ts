import { IsBoolean, IsNumber, IsOptional, IsString, IsUrl, Max, Min, MinLength } from 'class-validator';

export class UpsertPromotionDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsString()
  @MinLength(3)
  title!: string;

  @IsString()
  @MinLength(10)
  description!: string;

  @IsNumber()
  @Min(0)
  @Max(100)
  discountPercent!: number;

  @IsOptional()
  @IsString()
  validUntil?: string;

  @IsOptional()
  @IsBoolean()
  active?: boolean;

  @IsOptional()
  @IsUrl({ require_tld: false })
  bannerUrl?: string;
}
