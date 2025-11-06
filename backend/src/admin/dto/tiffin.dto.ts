import { IsArray, IsNumber, IsOptional, IsString, IsUrl, Min, MinLength } from 'class-validator';

export class UpsertTiffinDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsString()
  @MinLength(2)
  name!: string;

  @IsString()
  @MinLength(5)
  description!: string;

  @IsNumber()
  @Min(0)
  price!: number;

  @IsOptional()
  @IsUrl({ require_tld: false })
  imageUrl?: string;

  @IsArray()
  @IsString({ each: true })
  itemsIncluded!: string[];
}
