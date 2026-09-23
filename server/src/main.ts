import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // usuwa pola spoza DTO
      forbidNonWhitelisted: true, // rzuca błąd zamiast po cichu usuwać
      transform: true, // zamienia np. stringi z params na liczby zgodnie z typem w DTO
    }),
  );

  await app.listen(3000);
}

bootstrap();
