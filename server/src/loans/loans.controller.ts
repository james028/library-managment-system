import { Body, Controller, Post } from '@nestjs/common';
import { LoansService } from './loans.service.js';
import { CreateLoanDto } from './dto/create.loan.dto.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Loans')
@ApiBearerAuth()
@Controller('loans')
export class LoansController {
  constructor(private readonly loansService: LoansService) {}

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
}
