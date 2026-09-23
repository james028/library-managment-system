import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersRepository } from '../users/users.repository.js';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';

const SALT_ROUNDS = 10;

@Injectable()
@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    console.log(dto, "dto w register");
    const existing = await this.usersRepository.findByEmail(dto.email);
    if (existing) {
      // Rzucamy to świadomie tutaj, zamiast czekać na kod 23505 z pg —
      // sprawdzenie "z góry" jest czytelniejsze niż łapanie błędu bazy dla tego konkretnego przypadku.
      // Kod 23505 w exception filtrze zostaje jako siatka bezpieczeństwa na wypadek race condition.
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

  async login(dto: LoginDto) {
    console.log(dto, "dto w login");
    const user = await this.usersRepository.findByEmail(dto.email);

    // Celowo ten sam komunikat błędu dla "nie ma takiego usera" i "złe hasło" —
    // inaczej atakujący mógłby sprawdzać, które adresy email są zarejestrowane.
    if (!user) {
      throw new UnauthorizedException('Nieprawidłowy email lub hasło');
    }

    const passwordMatches = await bcrypt.compare(dto.password, user.password_hash);
    if (!passwordMatches) {
      throw new UnauthorizedException('Nieprawidłowy email lub hasło');
    }

    if (!user.is_active) {
      throw new UnauthorizedException('Konto zostało zablokowane');
    }

    return this.buildAuthResponse(user.id, user.email, user.role, user.first_name, user.last_name);
  }

  private buildAuthResponse(
    id: string,
    email: string,
    role: string,
    firstName: string,
    lastName: string,
  ) {
    const payload = { sub: id, email, role };

    return {
      accessToken: this.jwtService.sign(payload),
      user: { id, email, role, firstName, lastName }, // uwaga: brak password_hash — nigdy go nie zwracamy
    };
  }
}
