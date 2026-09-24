var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { IsUUID, IsOptional, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
export class CreateLoanDto {
    bookCopyId;
    userId;
    dueAt;
}
__decorate([
    ApiProperty({
        example: 'ca994797-88a1-4bb2-b497-d035c3bb3d61',
        description: 'UUID of the book copy to borrow',
    }),
    IsUUID(),
    __metadata("design:type", String)
], CreateLoanDto.prototype, "bookCopyId", void 0);
__decorate([
    ApiProperty({
        example: '1b5c7860-de7a-47fa-a01d-05df92862e69',
    }),
    IsUUID(),
    __metadata("design:type", String)
], CreateLoanDto.prototype, "userId", void 0);
__decorate([
    ApiPropertyOptional({
        example: '2026-10-01T23:59:59.000Z',
        description: 'Date and time when the book should be returned',
    }),
    IsOptional(),
    IsDateString(),
    __metadata("design:type", String)
], CreateLoanDto.prototype, "dueAt", void 0);
//# sourceMappingURL=create.loan.dto.js.map