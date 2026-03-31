import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ReportFraudDto } from './dto/report-fraud.dto';
import { FraudStatus } from '@prisma/client';

@Injectable()
export class FraudService {
  constructor(private readonly prisma: PrismaService) {}

  async reportFraud(citizenId: string, dto: ReportFraudDto) {
    const report = await this.prisma.fraudReport.create({
      data: {
        ...dto,
        citizenId,
        status: FraudStatus.PENDING_POLICE,
      },
    });
    return {
      message: 'Signalement de fraude enregistré avec succès. En attente de validation par la police.',
      report,
    };
  }

  async findMyFrauds(citizenId: string) {
    return this.prisma.fraudReport.findMany({
      where: { citizenId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getFraudDetails(citizenId: string, fraudId: string) {
    const report = await this.prisma.fraudReport.findUnique({
      where: { id: fraudId },
    });

    if (!report) throw new NotFoundException('Signalement introuvable');
    if (report.citizenId !== citizenId) {
      throw new ForbiddenException('Vous n\'avez pas accès à ce signalement');
    }

    return report;
  }

  // ──────────────────────────────────────────
  // POUR LA POLICE / L'ADMIN
  // ──────────────────────────────────────────

  async findAllPending() {
    return this.prisma.fraudReport.findMany({
      where: { status: FraudStatus.PENDING_POLICE },
      include: {
        citizen: {
          select: { firstName: true, lastName: true, email: true, phoneNumber: true, nationalId: true, kycStatus: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
