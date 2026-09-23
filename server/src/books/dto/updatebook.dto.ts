import { PartialType } from '@nestjs/mapped-types';
import { CreateBookDto } from './createbook.dto.js';

export class UpdateBookDto extends PartialType(CreateBookDto) {}