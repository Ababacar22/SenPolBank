// ==============================================
// SenPolBank — Prisma Module
// ==============================================
// Module NestJS qui encapsule le service Prisma.
// Marqué comme @Global pour être accessible partout
// sans devoir l'importer dans chaque module.
// ==============================================

import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // Rend PrismaService injectable partout
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
