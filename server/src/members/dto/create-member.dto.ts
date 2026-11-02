import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateMemberDto {
  @IsString() @IsNotEmpty() @MinLength(2) @MaxLength(50) firstName: string;

  @IsString() @IsNotEmpty() @MinLength(2) @MaxLength(50) lastName: string;

  @IsEmail() @MaxLength(255) email: string;

  @IsString() @Matches(/^[A-Z0-9-]{6,20}$/) cardNumber: string;
}
