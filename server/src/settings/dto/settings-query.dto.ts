// get-settings-query.dto.ts
import { Transform } from 'class-transformer';
import {
  ArrayMaxSize, IsArray, IsOptional, IsString, MaxLength,
} from 'class-validator';

export class GetSettingsQueryDto {
  @IsOptional()
  @Transform(({ value }) =>
    typeof value === 'string' ? value.split(',').map(s => s.trim()) : value,
  )
  @IsArray()
  @ArrayMaxSize(50)
  @IsString({ each: true })
  @MaxLength(100, { each: true })
  keys?: string[];
}