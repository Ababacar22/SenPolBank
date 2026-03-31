// ==============================================
// SenPolBank — API Gateway — Entry Point
// ==============================================
// Point d'entrée unique de la plateforme.
// Toutes les requêtes passent par ici avant
// d'être routées vers les microservices.
// Port : 3000
// ==============================================

import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ── Préfixe global ──
  // Toutes les routes commencent par /api
  app.setGlobalPrefix('api');

  // ── Validation globale ──
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // ── CORS ──
  app.enableCors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
  });

  // ── Swagger ──
  const config = new DocumentBuilder()
    .setTitle('SenPolBank API')
    .setDescription('API Gateway — Point d\'entrée unique de la plateforme SenPolBank')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // ── Démarrage ──
  const port = process.env.API_GATEWAY_PORT || 3000;
  await app.listen(port);
  console.log(`🌐 API Gateway is running on port ${port}`);
  console.log(`📖 Swagger docs: http://localhost:${port}/api/docs`);
}

bootstrap();
