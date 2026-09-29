import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guards.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { CreateBookCopyDto } from './dto/create-book-copy.dto.js';
import { BookCopiesService } from './book-copies.service.js';
import { UpdateBookCopyDto } from './dto/update-book-copy.dto.js';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Book Copies')
@Controller('book')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('librarian')
export class BookCopiesController {
  constructor(private readonly bookCopiesService: BookCopiesService) {}

  @ApiOperation({
    summary: 'Pobierz wszystkie egzemplarze książki',
    description:
      'Zwraca wszystkie fizyczne egzemplarze przypisane do wskazanej książki.',
  })
  @ApiParam({
    name: 'bookId',
    description: 'UUID książki',
    example: 'ca994797-88a1-4bb2-b497-d035c3bb3d61',
  })
  @ApiResponse({ status: 200, description: 'Lista egzemplarzy książki.' })
  @ApiResponse({
    status: 404,
    description: 'Książka nie istnieje.',
  })
  @Get('/:bookId/copies')
  findAllForBook(@Param('bookId') bookId: string) {
    return this.bookCopiesService.findAllForBook(bookId);
  }

  @Post('/:bookId/copies') create(
    @Param('bookId') bookId: string,
    @Body() dto: CreateBookCopyDto,
  ) {
    return this.bookCopiesService.create(bookId, dto);
  }

  // Update/delete operują na id egzemplarza, nie potrzebują już bookId w URL-u —
  // dlatego to osobna ścieżka /copies/:id, a nie zagnieżdżona pod /books/:bookId.
  @Patch('copies/:id') update(
    @Param('id') id: string,
    @Body() dto: UpdateBookCopyDto,
  ) {
    return this.bookCopiesService.update(id, dto);
  }

  @Delete('copies/:id') @HttpCode(HttpStatus.NO_CONTENT) remove(
    @Param('id') id: string,
  ) {
    return this.bookCopiesService.delete(id);
  }
}
