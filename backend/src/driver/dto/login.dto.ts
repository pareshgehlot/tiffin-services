import { IsString, MinLength } from 'class-validator';

export class DriverLoginDto {
  @IsString()
  identifier!: string;

  @IsString()
  @MinLength(6)
  password!: string;
}
