var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { IsString, IsOptional, IsInt, Min, Max, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
export class CreateBookDto {
    title;
    author;
    isbn;
    publisher;
    publishedYear;
    description;
}
__decorate([
    ApiProperty({
        example: 'Clean Code',
        description: 'Book title',
    }),
    IsString(),
    MaxLength(255),
    __metadata("design:type", String)
], CreateBookDto.prototype, "title", void 0);
__decorate([
    ApiProperty({
        example: 'Andrzej Sapkowski',
        description: 'Book author',
    }),
    IsString(),
    MaxLength(255),
    __metadata("design:type", String)
], CreateBookDto.prototype, "author", void 0);
__decorate([
    ApiPropertyOptional({
        example: '9780132350884',
        description: 'ISBN number',
    }),
    IsOptional(),
    IsString(),
    MaxLength(20),
    __metadata("design:type", String)
], CreateBookDto.prototype, "isbn", void 0);
__decorate([
    ApiPropertyOptional({
        example: 'Prentice Hall',
        description: 'Publisher name',
    }),
    IsOptional(),
    IsString(),
    MaxLength(255),
    __metadata("design:type", String)
], CreateBookDto.prototype, "publisher", void 0);
__decorate([
    ApiPropertyOptional({
        example: 2008,
        description: 'Publication year',
    }),
    IsOptional(),
    IsInt(),
    Min(1400),
    Max(new Date().getFullYear()),
    __metadata("design:type", Number)
], CreateBookDto.prototype, "publishedYear", void 0);
__decorate([
    ApiPropertyOptional({
        example: 'A handbook of agile software craftsmanship.',
        description: 'Book description',
    }),
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], CreateBookDto.prototype, "description", void 0);
//# sourceMappingURL=createbook.dto.js.map