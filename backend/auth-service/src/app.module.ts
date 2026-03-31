// ==============================================
// SenPolBank — Auth Service — App Module
// ==============================================
// Module racine du service d'authentification.
// Il importe tous les sous-modules nécessaires.
// ==============================================

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    // ── Configuration ──
    // Charge les variables d'environnement depuis .env
    ConfigModule.forRoot({
      isGlobal: true,  // Disponible dans tous les modules sans réimport
      envFilePath: '../../.env',
    }),

    // ── Prisma (accès BDD) ──
    PrismaModule,

    // ── Authentification ──
    AuthModule,
  ],
})
export class AppModule {}
