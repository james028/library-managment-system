import request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';

import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { AppModule } from '../src/app.module.js';
import { JwtAuthGuard } from '../src/auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../src/auth/guards/roles.guards.js';

describe('Members (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /members should return 200', async () => {
    const res = await request(app.getHttpServer()).get('/members');
    expect(res.status).toBe(200);
  });

  it('POST /members should return 400 for invalid email', async () => {
    const res = await request(app.getHttpServer()).post('/members').send({
      firstName: 'Jan',
      lastName: 'Kowalski',
      email: 'not-an-email',
      cardNumber: 'CARD-1',
    });

    expect(res.status).toBe(400);
  });
});
