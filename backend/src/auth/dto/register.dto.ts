import {
  IsEmail,
  IsString,
  MinLength,
  IsDateString,
  IsOptional,
} from 'class-validator';

export class RegisterDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8)
  password!: string;

  @IsString()
  employeeId!: string;

  @IsString()
  fullName!: string;

  @IsString()
  phone!: string;

  @IsString()
  birthPlace!: string;

  @IsDateString()
  birthDate!: string;

  @IsString()
  gender!: string;

  @IsString()
  position!: string;

  @IsOptional()
  @IsString()
  identityNumber?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  companyName?: string;

  @IsOptional()
  @IsString()
  profilePhoto?: string;
}
