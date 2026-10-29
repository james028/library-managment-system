var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { BadRequestException, ConflictException, Injectable, NotFoundException, } from '@nestjs/common';
import { LoansRepository } from './loans.repository.js';
import { SettingsService } from '../settings/settings.service.js';
const DEFAULT_LOAN_DAYS = 14;
const MIN_SEARCH_LENGTH = 2;
let LoansService = class LoansService {
    loansRepository;
    settingsService;
    constructor(loansRepository, settingsService) {
        this.loansRepository = loansRepository;
        this.settingsService = settingsService;
    }
    async borrow(dto) {
        const dueAt = dto.dueAt
            ? new Date(dto.dueAt)
            : new Date(Date.now() + DEFAULT_LOAN_DAYS * 24 * 60 * 60 * 1000);
        const loan = await this.loansRepository.borrow({
            bookCopyId: dto.bookCopyId,
            userId: dto.userId,
            dueAt,
        });
        if (!loan) {
            throw new ConflictException('Egzemplarz jest niedostępny do wypożyczenia (nie istnieje albo jest już wypożyczony)');
        }
        return loan;
    }
    async returnLoan(id) {
        const fineRatePerDay = await this.settingsService.getFineRatePerDay();
        const loan = await this.loansRepository.returnLoan(id, fineRatePerDay);
        if (!loan) {
            throw new NotFoundException('Wypożyczenie nie istnieje albo zostało już wcześniej zwrócone');
        }
        return loan;
    }
    findMyLoans(userId) {
        return this.loansRepository.findAllForUser(userId);
    }
    returnSummary() {
        return this.loansRepository.returnSummaryData();
    }
    getAllLoans(query) {
        const normalizedQuery = this.normalizeQuery(query);
        return this.loansRepository.returnAllLoans(normalizedQuery);
    }
    normalizeQuery(query) {
        const search = query.search?.trim();
        if (search !== undefined &&
            search.length > 0 &&
            search.length < MIN_SEARCH_LENGTH) {
            throw new BadRequestException(`Search phrase must contain at least ${MIN_SEARCH_LENGTH} characters.`);
        }
        return {
            ...query,
            search: search || undefined,
        };
    }
};
LoansService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [LoansRepository,
        SettingsService])
], LoansService);
export { LoansService };
//# sourceMappingURL=loans.service.js.map