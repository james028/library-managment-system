var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { UsersController } from './users.controller.js';
import { UsersService } from './users.service.js';
import { UsersRepository } from './users.repository.js';
let UsersModule = class UsersModule {
};
UsersModule = __decorate([
    Module({
        imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
        controllers: [UsersController],
        providers: [UsersService, UsersRepository],
        exports: [UsersRepository],
    })
], UsersModule);
export { UsersModule };
//# sourceMappingURL=users.module.js.map