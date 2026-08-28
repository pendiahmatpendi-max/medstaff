import { IsLatitude, IsLongitude, IsOptional, IsString } from 'class-validator';

export class ClockInDto {
  @IsLatitude()
  latitude!: number;

  @IsLongitude()
  longitude!: number;

  @IsOptional()
  @IsString()
  photo?: string;
}
