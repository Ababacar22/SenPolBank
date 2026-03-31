import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { SubmitKycDto } from './dto/submit-kyc.dto';
import { Role, KycStatus } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  // ──────────────────────────────────────────
  // UTILISATEURS (Citoyens, Police, etc.)
  // ──────────────────────────────────────────

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) throw new NotFoundException('Utilisateur introuvable');
    
    // Omit sensitive data
    const { password, refreshToken, ...profile } = user;
    return profile;
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: dto,
    });
    const { password, refreshToken, ...profile } = user;
    return profile;
  }

  async submitKyc(userId: string, dto: SubmitKycDto) {
    // Vérifier si le nationalId n'est pas déjà pris
    const existingKyc = await this.prisma.user.findUnique({
      where: { nationalId: dto.nationalId },
    });

    if (existingKyc && existingKyc.id !== userId) {
      throw new BadRequestException('Ce numéro de pièce d\'identité est déjà utilisé');
    }

    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        nationalId: dto.nationalId,
        kycStatus: KycStatus.PENDING, // Passe en attente de vérification
      },
    });

    return { message: 'Identité soumise avec succès, en attente de validation.' };
  }

  // ──────────────────────────────────────────
  // ADMINISTRATEURS
  // ──────────────────────────────────────────

  async findAll() {
    const users = await this.prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true, email: true, firstName: true, lastName: true, 
        role: true, kycStatus: true, isActive: true, createdAt: true
      }
    });
    return users;
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('Utilisateur introuvable');
    
    const { password, refreshToken, ...profile } = user;
    return profile;
  }

  async updateRole(id: string, role: Role) {
    const user = await this.prisma.user.update({
      where: { id },
      data: { role },
    });
    return { message: `Rôle mis à jour: ${role}` };
  }

  async toggleStatus(id: string, isActive: boolean) {
    const user = await this.prisma.user.update({
      where: { id },
      data: { isActive },
    });
    return { message: `Statut du compte mis à jour: ${isActive ? 'Actif' : 'Suspendu'}` };
  }

  async verifyKyc(id: string, status: KycStatus) {
    if (status === KycStatus.NONE || status === KycStatus.PENDING) {
      throw new BadRequestException('Statut invalide pour la vérification KYC');
    }
    
    await this.prisma.user.update({
      where: { id },
      data: { kycStatus: status },
    });
    return { message: `Statut KYC mis à jour: ${status}` };
  }
}
