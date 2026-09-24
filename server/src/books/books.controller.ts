import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { RolesGuard } from '../auth/guards/roles.guards.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { BooksService } from './books.service.js';
import { CreateBookDto } from './dto/createbook.dto.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('books')
@ApiTags('Books')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard) // stosuje się do WSZYSTKICH endpointów w tym kontrolerze
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  // Brak @Roles() = dostępne dla każdego zalogowanego (member i librarian) —
  // JwtAuthGuard i tak wymaga bycia zalogowanym, RolesGuard przepuszcza gdy nie ma wymogu rol
  @Get()
  @ApiOperation({
    summary: 'Get all books',
    description: 'Returns paginated list of books',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    example: 1,
    description: 'Page number',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    example: 10,
    description: 'Number of books per page',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    example: 'Clean Code',
    description: 'Search by book title',
  })
  @ApiResponse({
    status: 200,
    description: 'Books returned successfully.',
  })
  @ApiResponse({
    status: 401,
    description: 'JWT token is missing or invalid.',
  })
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
  @ApiOperation({
    summary: 'Create a book',
    description: 'Creates a new book. Requires librarian role.',
  })
  @ApiResponse({
    status: 201,
    description: 'Book created successfully.',
  })
  @ApiResponse({
    status: 401,
    description: 'JWT token is missing or invalid.',
  })
  @ApiResponse({
    status: 403,
    description: 'User does not have librarian role.',
  })
  @ApiResponse({
    status: 409,
    description: 'Book with this ISBN already exists.',
  })
  create(@Body() dto: CreateBookDto) {
    console.log(dto);
    return this.booksService.create(dto);
  }
}
