var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { IsEmail, IsString, MinLength, MaxLength } from 'class-validator';
export class RegisterDto {
    email;
    password;
    firstName;
    lastName;
}
__decorate([
    IsEmail({}, { message: 'Podaj poprawny adres email' }),
    __metadata("design:type", String)
], RegisterDto.prototype, "email", void 0);
__decorate([
    IsString(),
    MinLength(8, { message: 'Hasło musi mieć co najmniej 8 znaków' }),
    MaxLength(72, { message: 'Hasło jest za długie' }),
    __metadata("design:type", String)
], RegisterDto.prototype, "password", void 0);
__decorate([
    IsString(),
    MinLength(2),
    __metadata("design:type", String)
], RegisterDto.prototype, "firstName", void 0);
__decorate([
    IsString(),
    MinLength(2),
    __metadata("design:type", String)
], RegisterDto.prototype, "lastName", void 0);
//# sourceMappingURL=register.dto.js.map