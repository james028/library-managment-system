import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReservationDto {
  @ApiProperty({
    example: '21c51d0c-2e9e-45ec-a2aa-7f3b319c4e4d',
    description: 'id book',
  })
  @IsUUID()
  bookId: string;
}