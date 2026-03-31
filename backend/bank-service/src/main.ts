import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));
  app.enableCors({ origin: process.env.CORS_ORIGIN || 'http://localhost:5173', credentials: true });

  const config = new DocumentBuilder()
    .setTitle('SenPolBank Bank Service')
    .setDescription('API de traitement bancaire des fraudes')
    .setVersion('1.0').addBearerAuth().build();
  SwaggerModule.setup('api/docs', app, SwaggerModule.createDocument(app, config));

  const port = process.env.BANK_SERVICE_PORT || 3005;
  await app.listen(port);
  console.log(`🏦 Bank Service is running on port ${port}`);
}
bootstrap();
