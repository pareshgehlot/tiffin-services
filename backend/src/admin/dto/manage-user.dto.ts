import { IsBoolean, IsEmail, IsIn, IsOptional, IsString, MinLength } from 'class-validator';
import { UserRole } from '../../common/in-memory.database';

export class ManageUserDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsString()
  @IsIn(['admin', 'customer', 'driver'])
  role!: UserRole;

  @IsString()
  @MinLength(2)
  name!: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;

  @IsOptional()
  @IsBoolean()
  verified?: boolean;
}
