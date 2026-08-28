import {
  IsBoolean,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateShiftDto {
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name!: string;

  @IsString()
  @MinLength(2)
  @MaxLength(50)
  category!: string;

  @IsString()
  @Matches(
    /^([01]\d|2[0-3]):[0-5]\d$/,
    {
      message: 'startTime harus menggunakan format HH:mm yang valid',
    },
  )
  startTime!: string;

  @IsString()
  @Matches(
    /^([01]\d|2[0-3]):[0-5]\d$/,
    {
      message: 'endTime harus menggunakan format HH:mm yang valid',
    },
  )
  endTime!: string;

  @IsOptional()
  @IsBoolean()
  crossesMidnight?: boolean;
}