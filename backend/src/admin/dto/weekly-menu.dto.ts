import { IsArray, IsIn, IsString } from 'class-validator';

export class WeeklyMenuEntryDto {
  @IsIn(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'])
  day!: string;

  @IsString()
  tiffinId!: string;
}

export class SetWeeklyMenuDto {
  @IsArray()
  entries!: WeeklyMenuEntryDto[];
}
