import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { FraudStatus } from '@prisma/client';

@Injectable()
export class BankService {
  constructor(private readonly prisma: PrismaService) {}

  async getPendingFrauds() {
    return this.prisma.fraudReport.findMany({
      where: { status: FraudStatus.PENDING_BANK },
      include: {
        citizen: {
          select: { id: true, firstName: true, lastName: true, email: true, phoneNumber: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getFraudDetail(fraudId: string) {
    const report = await this.prisma.fraudReport.findUnique({
      where: { id: fraudId },
      include: {
        citizen: {
          select: { id: true, firstName: true, lastName: true, email: true, phoneNumber: true, nationalId: true },
        },
      },
    });
    if (!report) throw new NotFoundException('Signalement introuvable');
    return report;
  }

  async resolveFraud(bankUserId: string, fraudId: string, note?: string) {
    const report = await this.prisma.fraudReport.findUnique({ where: { id: fraudId } });
    if (!report) throw new NotFoundException('Signalement introuvable');
    if (report.status !== FraudStatus.PENDING_BANK) {
      throw new BadRequestException('Ce signalement n\'est pas en attente d\'action bancaire');
    }

    await this.prisma.fraudReport.update({
      where: { id: fraudId },
      data: {
        status: FraudStatus.RESOLVED,
        bankNote: note || 'Compte bloqué',
        resolvedAt: new Date(),
      },
    });

    return { message: '✅ Fraude résolue. Compte bloqué avec succès.' };
  }

  async rejectFraud(bankUserId: string, fraudId: string, note: string) {
    const report = await this.prisma.fraudReport.findUnique({ where: { id: fraudId } });
    if (!report) throw new NotFoundException('Signalement introuvable');
    if (report.status !== FraudStatus.PENDING_BANK) {
      throw new BadRequestException('Ce signalement n\'est pas en attente d\'action bancaire');
    }

    await this.prisma.fraudReport.update({
      where: { id: fraudId },
      data: {
        status: FraudStatus.REJECTED,
        bankNote: note,
      },
    });

    return { message: 'Signalement rejeté par la banque.' };
  }
}
