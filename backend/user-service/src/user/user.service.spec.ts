// ==============================================
// SenPolBank — User Service — Unit Tests
// ==============================================
import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { UserService } from './user.service';
import { PrismaService } from '../prisma/prisma.service';
import { Role, KycStatus } from '@prisma/client';

const mockPrismaService = {
  user: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    update: jest.fn(),
  },
};

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    jest.clearAllMocks();
  });

  describe('getProfile', () => {
    it('devrait retourner le profil de l\'utilisateur', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue({
        id: 'user-1',
        email: 'test@senpolbank.sn',
        password: 'hash',
        firstName: 'John',
        lastName: 'Doe',
      });

      const result = await service.getProfile('user-1');
      expect(result).toEqual(expect.objectContaining({ email: 'test@senpolbank.sn' }));
      expect(result).not.toHaveProperty('password');
    });

    it('devrait jeter NotFoundException si introuvable', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);
      await expect(service.getProfile('unknown')).rejects.toThrow(NotFoundException);
    });
  });

  describe('submitKyc', () => {
    it('devrait mettre à jour nationalId et kycStatus', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);
      mockPrismaService.user.update.mockResolvedValue({ id: 'user-1' });

      await service.submitKyc('user-1', { nationalId: 'SN1234' });

      expect(mockPrismaService.user.update).toHaveBeenCalledWith({
        where: { id: 'user-1' },
        data: { nationalId: 'SN1234', kycStatus: KycStatus.PENDING },
      });
    });

    it('devrait jeter BadRequestException si nationalId est déjà pris par un autre', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue({ id: 'user-2' });

      await expect(service.submitKyc('user-1', { nationalId: 'SN1234' })).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('Admin actions', () => {
    it('devrait changer le rôle', async () => {
      mockPrismaService.user.update.mockResolvedValue({});
      const result = await service.updateRole('user-1', Role.POLICE);
      expect(result).toEqual({ message: 'Rôle mis à jour: POLICE' });
      expect(mockPrismaService.user.update).toHaveBeenCalledWith({
        where: { id: 'user-1' },
        data: { role: Role.POLICE },
      });
    });

    it('devrait vérifier le KYC', async () => {
      mockPrismaService.user.update.mockResolvedValue({});
      const result = await service.verifyKyc('user-1', KycStatus.VERIFIED);
      expect(result.message).toContain('VERIFIED');
    });
  });
});
