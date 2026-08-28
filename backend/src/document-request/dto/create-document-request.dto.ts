import {
  IsObject,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateDocumentRequestDto {
  @IsString()
  @MaxLength(100)
  requestType!: string;

  @IsString()
  @MaxLength(2000)
  description!: string;

  @IsOptional()
  @IsObject()
  oldData?: Record<string, any>;

  @IsOptional()
  @IsObject()
  newData?: Record<string, any>;

  @IsOptional()
  @IsString()
  attachment?: string;
}
