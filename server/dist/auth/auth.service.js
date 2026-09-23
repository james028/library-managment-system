var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { ConflictException, Injectable } from '@nestjs/common';
import { UsersRepository } from '../users/users.repository.js';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
const SALT_ROUNDS = 10;
let AuthService = class AuthService {
    usersRepository;
    jwtService;
    constructor(usersRepository, jwtService) {
        this.usersRepository = usersRepository;
        this.jwtService = jwtService;
    }
    async register(dto) {
        console.log(dto, "dto w register");
        const existing = await this.usersRepository.findByEmail(dto.email);
        if (existing) {
            throw new ConflictException('Użytkownik z tym adresem email już istnieje');
        }
        const passwordHash = await bcrypt.hash(dto.password, SALT_ROUNDS);
        const user = await this.usersRepository.create({
            email: dto.email,
            passwordHash,
            firstName: dto.firstName,
            lastName: dto.lastName,
        });
        return this.buildAuthResponse(user.id, user.email, user.role, user.first_name, user.last_name);
    }
    async login(dto) {
        console.log(dto, "dto w login");
    }
    buildAuthResponse(id, email, role, firstName, lastName) {
        const payload = { sub: id, email, role };
        return {
            accessToken: this.jwtService.sign(payload),
            user: { id, email, role, firstName, lastName },
        };
    }
};
AuthService = __decorate([
    Injectable(),
    Injectable(),
    __metadata("design:paramtypes", [UsersRepository,
        JwtService])
], AuthService);
export { AuthService };
//# sourceMappingURL=auth.service.js.map