import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { PoliceService } from './police.service';
import { PrismaService } from '../prisma/prisma.service';
import { FraudStatus } from '@prisma/client';

const mockPrisma = {
  fraudReport: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
  },
};

describe('PoliceService', () => {
  let service: PoliceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PoliceService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();
    service = module.get<PoliceService>(PoliceService);
    jest.clearAllMocks();
  });

  describe('validateFraud', () => {
    it('devrait valider un signalement PENDING_POLICE → PENDING_BANK', async () => {
      mockPrisma.fraudReport.findUnique.mockResolvedValue({ id: 'f1', status: FraudStatus.PENDING_POLICE });
      mockPrisma.fraudReport.update.mockResolvedValue({});

      const result = await service.validateFraud('police-1', 'f1', 'Vérifié');
      expect(result.message).toContain('Transmis à la banque');
      expect(mockPrisma.fraudReport.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ status: FraudStatus.PENDING_BANK, policeId: 'police-1' }),
        }),
      );
    });

    it('devrait jeter NotFoundException si la fraude n\'existe pas', async () => {
      mockPrisma.fraudReport.findUnique.mockResolvedValue(null);
      await expect(service.validateFraud('p1', 'xxx')).rejects.toThrow(NotFoundException);
    });

    it('devrait rejeter si le statut n\'est pas PENDING_POLICE', async () => {
      mockPrisma.fraudReport.findUnique.mockResolvedValue({ id: 'f1', status: FraudStatus.PENDING_BANK });
      await expect(service.validateFraud('p1', 'f1')).rejects.toThrow(BadRequestException);
    });
  });

  describe('rejectFraud', () => {
    it('devrait rejeter un signalement PENDING_POLICE → REJECTED', async () => {
      mockPrisma.fraudReport.findUnique.mockResolvedValue({ id: 'f1', status: FraudStatus.PENDING_POLICE });
      mockPrisma.fraudReport.update.mockResolvedValue({});

      const result = await service.rejectFraud('police-1', 'f1', 'Infos insuffisantes');
      expect(result.message).toContain('rejeté');
      expect(mockPrisma.fraudReport.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ status: FraudStatus.REJECTED, rejectionReason: 'Infos insuffisantes' }),
        }),
      );
    });
  });

  describe('getPendingFrauds', () => {
    it('devrait retourner les signalements en attente', async () => {
      mockPrisma.fraudReport.findMany.mockResolvedValue([{ id: 'f1' }]);
      const result = await service.getPendingFrauds();
      expect(result).toHaveLength(1);
    });
  });
});
