import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { FraudStatus } from '@prisma/client';

@Injectable()
export class PoliceService {
  constructor(private readonly prisma: PrismaService) {}

  // ── Lister les signalements en attente ──
  async getPendingFrauds() {
    return this.prisma.fraudReport.findMany({
      where: { status: FraudStatus.PENDING_POLICE },
      include: {
        citizen: {
          select: {
            id: true, firstName: true, lastName: true,
            email: true, phoneNumber: true, nationalId: true, kycStatus: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // ── Détail d'un signalement ──
  async getFraudDetail(fraudId: string) {
    const report = await this.prisma.fraudReport.findUnique({
      where: { id: fraudId },
      include: {
        citizen: {
          select: {
            id: true, firstName: true, lastName: true,
            email: true, phoneNumber: true, nationalId: true, kycStatus: true,
          },
        },
      },
    });
    if (!report) throw new NotFoundException('Signalement introuvable');
    return report;
  }

  // ── Valider un signalement → PENDING_BANK ──
  async validateFraud(policeId: string, fraudId: string, note?: string) {
    const report = await this.prisma.fraudReport.findUnique({ where: { id: fraudId } });
    if (!report) throw new NotFoundException('Signalement introuvable');
    if (report.status !== FraudStatus.PENDING_POLICE) {
      throw new BadRequestException('Ce signalement n\'est pas en attente de validation police');
    }

    await this.prisma.fraudReport.update({
      where: { id: fraudId },
      data: {
        status: FraudStatus.PENDING_BANK,
        policeId,
        policeNote: note || null,
        validatedAt: new Date(),
      },
    });

    return { message: 'Signalement validé. Transmis à la banque pour action.' };
  }

  // ── Rejeter un signalement → REJECTED ──
  async rejectFraud(policeId: string, fraudId: string, reason: string) {
    const report = await this.prisma.fraudReport.findUnique({ where: { id: fraudId } });
    if (!report) throw new NotFoundException('Signalement introuvable');
    if (report.status !== FraudStatus.PENDING_POLICE) {
      throw new BadRequestException('Ce signalement n\'est pas en attente de validation police');
    }

    await this.prisma.fraudReport.update({
      where: { id: fraudId },
      data: {
        status: FraudStatus.REJECTED,
        policeId,
        rejectionReason: reason,
      },
    });

    return { message: 'Signalement rejeté.' };
  }
}
