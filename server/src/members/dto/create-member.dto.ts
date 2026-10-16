import {
  IsString,
  Matches,
} from 'class-validator';

export class CreateMemberDto {
  @IsString()
  @Matches(/^[A-Z0-9-]{6,20}$/)
  cardNumber: string;
}