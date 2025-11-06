import { IsBoolean, IsOptional, IsString, IsUrl } from 'class-validator';

export class UpdateIntegrationSettingsDto {
  @IsOptional()
  @IsUrl({ require_tld: false })
  googleBusinessProfileUrl?: string;

  @IsOptional()
  @IsString()
  googlePlaceId?: string;

  @IsOptional()
  @IsBoolean()
  enableReviewSync?: boolean;
}
