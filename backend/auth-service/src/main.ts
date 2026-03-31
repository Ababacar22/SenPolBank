// ==============================================
// SenPolBank — Auth Service — Entry Point
// ==============================================
// Ce fichier démarre le microservice d'authentification.
// Il écoute sur le port 3001.
// ==============================================

import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ── Validation globale ──
  // Toutes les requêtes sont automatiquement validées
  // via les DTOs et class-validator
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,        // Supprime les propriétés non déclarées dans le DTO
      forbidNonWhitelisted: true, // Rejette si propriétés inconnues
      transform: true,        // Transforme automatiquement les types
    }),
  );

  // ── CORS ──
  app.enableCors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
  });

  // ── Swagger / OpenAPI ──
  const config = new DocumentBuilder()
    .setTitle('SenPolBank Auth Service')
    .setDescription('API d\'authentification — register, login, JWT, rôles')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // ── Démarrage ──
  const port = process.env.AUTH_SERVICE_PORT || 3001;
  await app.listen(port);
  console.log(`🔐 Auth Service is running on port ${port}`);
  console.log(`📖 Swagger docs: http://localhost:${port}/api/docs`);
}

bootstrap();
