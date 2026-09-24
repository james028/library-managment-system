import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // usuwa pola spoza DTO
      forbidNonWhitelisted: true, // rzuca błąd zamiast po cichu usuwać
      transform: true, // zamienia np. stringi z params na liczby zgodnie z typem w DTO
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Library Management API')
    .setDescription('API for library management system')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('docs', app, document);

  await app.listen(3000);
}

bootstrap();
