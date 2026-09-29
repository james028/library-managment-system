var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CreateReservationDto {
    bookId;
}
__decorate([
    ApiProperty({
        example: '21c51d0c-2e9e-45ec-a2aa-7f3b319c4e4d',
        description: 'id book',
    }),
    IsUUID(),
    __metadata("design:type", String)
], CreateReservationDto.prototype, "bookId", void 0);
//# sourceMappingURL=create-reservation.dto.js.map