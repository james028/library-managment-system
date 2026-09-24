import { Body, Controller, Post } from '@nestjs/common';
import { LoansService } from './loans.service.js';
import { CreateLoanDto } from './dto/create.loan.dto.js';
import { Roles } from '../auth/decorators/roles.decorator.js';

@Controller('loans')
export class LoansController {
  constructor(private readonly loansService: LoansService) {}

  @Post() @Roles('librarian') borrow(@Body() dto: CreateLoanDto) {
    return this.loansService.borrow(dto);
  }
}
