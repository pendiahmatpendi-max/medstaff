import {
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

enum ScheduleDayType {
  KERJA = 'KERJA',
  LIBUR = 'LIBUR',
}

export class CreateScheduleDto {
  @IsUUID()
  employeeId!: string;

  @IsDateString()
  scheduleDate!: string;

  @IsOptional()
  @IsUUID()
  shiftId?: string;

  @IsOptional()
  @IsEnum(ScheduleDayType)
  dayType?: ScheduleDayType;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  note?: string;
}