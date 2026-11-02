import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { SettingsService } from './settings/settings.service.js';
import { LoansService } from './loans/loans.service.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // usuwa pola spoza DTO
      forbidNonWhitelisted: true, // rzuca błąd zamiast po cichu usuwać
      transform: true, // zamienia np. stringi z params na liczby zgodnie z typem w DTO
    }),
  );

  app.enableCors({
    origin: 'http://localhost:4200', // Adres Twojego Angulara w dev mode (lub domena produkcyjna np. 'https://mojabiblioteka.pl')
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('Library Management API')
    .setDescription('API for library management system')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  //const loansService = app.get(LoansService);
  // Wywołujemy zagnieżdżoną funkcję bezpośrednio!
  //const result = await loansService.returnLoan('22');
  //console.log('--- WYNIK DIAGNOSTYKI ---', result);

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('docs', app, document);

  await app.listen(3000);
}

bootstrap();
