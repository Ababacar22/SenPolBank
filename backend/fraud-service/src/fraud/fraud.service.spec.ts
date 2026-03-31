import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { FraudService } from './fraud.service';
import { PrismaService } from '../prisma/prisma.service';
import { FraudStatus } from '@prisma/client';

const mockPrismaService = {
  fraudReport: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
  },
};

describe('FraudService', () => {
  let service: FraudService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FraudService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<FraudService>(FraudService);
    jest.clearAllMocks();
  });

  describe('reportFraud', () => {
    it('devrait créer un signalement de fraude avec le statut PENDING_POLICE', async () => {
      const dto = { title: 'Vol', description: 'desc', bankName: 'BOA', bankAccount: '123' };
      mockPrismaService.fraudReport.create.mockResolvedValue({ id: 'fraud-1', ...dto, status: FraudStatus.PENDING_POLICE });

      const result = await service.reportFraud('citizen-1', dto);

      expect(result.message).toContain('enregistré avec succès');
      expect(mockPrismaService.fraudReport.create).toHaveBeenCalledWith({
        data: { ...dto, citizenId: 'citizen-1', status: FraudStatus.PENDING_POLICE },
      });
    });
  });

  describe('findMyFrauds', () => {
    it('devrait retourner les fraudes d\'un citoyen', async () => {
      mockPrismaService.fraudReport.findMany.mockResolvedValue([{ id: 'fraud-1' }]);
      const result = await service.findMyFrauds('citizen-1');
      expect(result).toHaveLength(1);
    });
  });

  describe('getFraudDetails', () => {
    it('devrait jeter NotFoundException si la fraude n\'existe pas', async () => {
      mockPrismaService.fraudReport.findUnique.mockResolvedValue(null);
      await expect(service.getFraudDetails('citizen-1', 'fraud-99')).rejects.toThrow(NotFoundException);
    });

    it('devrait jeter ForbiddenException si la fraude appartient à un autre citoyen', async () => {
      mockPrismaService.fraudReport.findUnique.mockResolvedValue({ id: 'fraud-1', citizenId: 'citizen-2' });
      await expect(service.getFraudDetails('citizen-1', 'fraud-1')).rejects.toThrow(ForbiddenException);
    });

    it('devrait retourner la fraude si elle appartient au citoyen', async () => {
      mockPrismaService.fraudReport.findUnique.mockResolvedValue({ id: 'fraud-1', citizenId: 'citizen-1' });
      const result = await service.getFraudDetails('citizen-1', 'fraud-1');
      expect(result.id).toBe('fraud-1');
    });
  });

  describe('findAllPending', () => {
    it('devrait retourner les fraudes en attente de police', async () => {
      mockPrismaService.fraudReport.findMany.mockResolvedValue([{ id: 'fraud-1', status: FraudStatus.PENDING_POLICE }]);
      const result = await service.findAllPending();
      expect(result).toHaveLength(1);
      expect(mockPrismaService.fraudReport.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: { status: FraudStatus.PENDING_POLICE } })
      );
    });
  });
});
