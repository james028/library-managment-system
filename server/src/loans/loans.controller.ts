import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { LoansService } from './loans.service.js';
import { CreateLoanDto } from './dto/create.loan.dto.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import type { CurrentUserPayload } from '../common/decorators/current-user.decorator.js';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guards.js';
import { PaginatedMembers } from '../members/interfaces/paginated-members.interface.dto.js';
import { QueryLoanDto } from './dto/query-loan.dto.js';

@ApiTags('Loans')
@ApiBearerAuth()
@Controller('loans')
@UseGuards(JwtAuthGuard, RolesGuard)
export class LoansController {
  constructor(private readonly loansService: LoansService) {}

  @Get('me')
  @ApiOperation({
    summary: 'List all of loans by user',
    description: 'list all of loans',
  })
  findMyLoans(@CurrentUser() user: CurrentUserPayload) {
    return this.loansService.findMyLoans(user.userId);
  }

  @Post()
  @Roles('librarian')
  @ApiOperation({
    summary: 'Borrow a book copy',
    description: 'Creates a new loan for the authenticated user.',
  })
  @ApiResponse({
    status: 201,
    description: 'Book copy successfully borrowed.',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid loan data.',
  })
  @ApiResponse({
    status: 404,
    description: 'Book copy not found.',
  })
  @ApiResponse({
    status: 409,
    description: 'Book copy is not available for borrowing.',
  })
  borrow(@Body() dto: CreateLoanDto) {
    return this.loansService.borrow(dto);
  }

  @ApiOperation({
    summary: 'Return a loan book',
    description: 'Return loan book and update book copies',
  })
  @Patch(':id/return')
  @Roles('librarian')
  returnLoan(@Param('id') id: string) {
    return this.loansService.returnLoan(id);
  }

  @ApiOperation({
    summary: 'Return a summary loans',
    description: 'Return four values in loans summary',
  })
  @Get('/summary')
  @Roles('librarian')
  summaryLoans() {
    return this.loansService.returnSummary();
  }

  @Get()
  @ApiOperation({ summary: 'Get paginated loans' })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
  })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: ['ACTIVE', 'OVERDUE', 'RETURNED'],
  })
  @ApiQuery({ name: 'borrowedFrom', required: false, type: Date })
  @ApiQuery({
    name: 'borrowedTo',
    required: false,
    type: Date,
  })
  @ApiQuery({ name: 'returnedFrom', required: false, type: Date })
  @ApiQuery({
    name: 'returnedTo',
    required: false,
    type: Date,
  })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({
    name: 'size',
    required: false,
    type: Number,
  })
  getAllLoans(@Query() query: QueryLoanDto): Promise<PaginatedMembers> {
    return this.loansService.getAllLoans(query);
  }
}
