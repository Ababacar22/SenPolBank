import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { BankService } from './bank.service';
import { PrismaService } from '../prisma/prisma.service';
import { FraudStatus } from '@prisma/client';

const mockPrisma = {
  fraudReport: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
  },
};

describe('BankService', () => {
  let service: BankService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BankService, { provide: PrismaService, useValue: mockPrisma }],
    }).compile();
    service = module.get<BankService>(BankService);
    jest.clearAllMocks();
  });

  describe('resolveFraud', () => {
    it('devrait résoudre une fraude PENDING_BANK → RESOLVED', async () => {
      mockPrisma.fraudReport.findUnique.mockResolvedValue({ id: 'f1', status: FraudStatus.PENDING_BANK });
      mockPrisma.fraudReport.update.mockResolvedValue({});

      const result = await service.resolveFraud('bank-1', 'f1', 'Compte bloqué');
      expect(result.message).toContain('résolue');
      expect(mockPrisma.fraudReport.update).toHaveBeenCalledWith(
        expect.objectContaining({ data: expect.objectContaining({ status: FraudStatus.RESOLVED }) }),
      );
    });

    it('devrait jeter NotFoundException si fraude inexistante', async () => {
      mockPrisma.fraudReport.findUnique.mockResolvedValue(null);
      await expect(service.resolveFraud('b1', 'xxx')).rejects.toThrow(NotFoundException);
    });

    it('devrait rejeter si statut n\'est pas PENDING_BANK', async () => {
      mockPrisma.fraudReport.findUnique.mockResolvedValue({ id: 'f1', status: FraudStatus.PENDING_POLICE });
      await expect(service.resolveFraud('b1', 'f1')).rejects.toThrow(BadRequestException);
    });
  });

  describe('rejectFraud', () => {
    it('devrait rejeter une fraude PENDING_BANK → REJECTED', async () => {
      mockPrisma.fraudReport.findUnique.mockResolvedValue({ id: 'f1', status: FraudStatus.PENDING_BANK });
      mockPrisma.fraudReport.update.mockResolvedValue({});

      const result = await service.rejectFraud('bank-1', 'f1', 'Compte introuvable');
      expect(result.message).toContain('rejeté');
      expect(mockPrisma.fraudReport.update).toHaveBeenCalledWith(
        expect.objectContaining({ data: expect.objectContaining({ status: FraudStatus.REJECTED, bankNote: 'Compte introuvable' }) }),
      );
    });
  });

  describe('getPendingFrauds', () => {
    it('devrait retourner les fraudes en attente bancaire', async () => {
      mockPrisma.fraudReport.findMany.mockResolvedValue([{ id: 'f1' }]);
      const result = await service.getPendingFrauds();
      expect(result).toHaveLength(1);
    });
  });
});
