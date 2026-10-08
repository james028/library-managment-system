import { Body, Controller, Param, Patch, Post, Get, UseGuards } from '@nestjs/common';
import { LoansService } from './loans.service.js';
import { CreateLoanDto } from './dto/create.loan.dto.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';
import type { CurrentUserPayload } from '../common/decorators/current-user.decorator.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guards.js';

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
  findMyLoans(
    @CurrentUser() user: CurrentUserPayload,
  ) {
    console.log(user, "user");
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
}


