import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { RolesGuard } from '../auth/guards/roles.guards.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { BooksService } from './books.service.js';
import { CreateBookDto } from './dto/createbook.dto.js';
import { Roles } from '../auth/decorators/roles.decorator.js';

@Controller('books')
@UseGuards(JwtAuthGuard, RolesGuard) // stosuje się do WSZYSTKICH endpointów w tym kontrolerze
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  // Brak @Roles() = dostępne dla każdego zalogowanego (member i librarian) —
  // JwtAuthGuard i tak wymaga bycia zalogowanym, RolesGuard przepuszcza gdy nie ma wymogu rol
  @Get()
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
  ) {
    return this.booksService.findAllBooks(
      page ? parseInt(page, 10) : undefined,
      limit ? parseInt(limit, 10) : undefined,
      search,
    );
  }


  @Post()
  @Roles('member')
  create(@Body() dto: CreateBookDto) {
    console.log(dto);
    return this.booksService.create(dto);
  }
}
