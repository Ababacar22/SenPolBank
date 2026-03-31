// ==============================================
// SenPolBank — Prisma Service
// ==============================================
// Ce service étend PrismaClient et gère la connexion
// à PostgreSQL. NestJS appelle automatiquement
// onModuleInit() au démarrage et enableShutdownHooks()
// pour fermer proprement la connexion.
//
// POURQUOI étendre PrismaClient ?
// - Permet d'injecter Prisma comme service NestJS
// - Gère le lifecycle (connexion/déconnexion)
// - Un seul pool de connexions partagé
// ==============================================

import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    // Connexion automatique à PostgreSQL au démarrage du module
    await this.$connect();
    console.log('📦 Prisma connected to PostgreSQL');
  }
}
