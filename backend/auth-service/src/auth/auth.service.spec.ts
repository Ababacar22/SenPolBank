// ==============================================
// SenPolBank — Auth Service — Unit Tests
// ==============================================
// Tests unitaires pour le AuthService.
// On mock Prisma, JwtService et ConfigService
// pour tester la logique métier isolément.
// ==============================================

import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';

// ── MOCKS ──
// On simule les dépendances pour ne tester que la logique du service

const mockPrismaService = {
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
};

const mockJwtService = {
  signAsync: jest.fn(),
};

const mockConfigService = {
  get: jest.fn().mockReturnValue('test-jwt-secret'),
};

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);

    // Reset tous les mocks avant chaque test
    jest.clearAllMocks();
  });

  // ══════════════════════════════════════════
  // REGISTER
  // ══════════════════════════════════════════

  describe('register', () => {
    const registerDto = {
      email: 'test@senpolbank.sn',
      password: 'MotDePasse123!',
      firstName: 'Amadou',
      lastName: 'Diallo',
    };

    it('devrait créer un utilisateur et retourner des tokens', async () => {
      // Arrange : l'email n'existe pas encore
      mockPrismaService.user.findUnique.mockResolvedValue(null);
      mockPrismaService.user.create.mockResolvedValue({
        id: 'uuid-123',
        email: registerDto.email,
        role: 'CITIZEN',
      });
      mockPrismaService.user.update.mockResolvedValue({});
      mockJwtService.signAsync
        .mockResolvedValueOnce('access-token-mock')
        .mockResolvedValueOnce('refresh-token-mock');

      // Act
      const result = await service.register(registerDto);

      // Assert
      expect(result).toEqual({
        accessToken: 'access-token-mock',
        refreshToken: 'refresh-token-mock',
      });
      expect(mockPrismaService.user.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          email: registerDto.email,
          firstName: registerDto.firstName,
          lastName: registerDto.lastName,
          role: 'CITIZEN',
        }),
      });
    });

    it('devrait rejeter si l\'email existe déjà', async () => {
      // Arrange : l'email existe
      mockPrismaService.user.findUnique.mockResolvedValue({
        id: 'existing-user',
        email: registerDto.email,
      });

      // Act & Assert
      await expect(service.register(registerDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  // ══════════════════════════════════════════
  // LOGIN
  // ══════════════════════════════════════════

  describe('login', () => {
    const loginDto = {
      email: 'test@senpolbank.sn',
      password: 'MotDePasse123!',
    };

    it('devrait connecter un utilisateur avec les bons identifiants', async () => {
      // Arrange
      const hashedPassword = await bcrypt.hash(loginDto.password, 10);
      mockPrismaService.user.findUnique.mockResolvedValue({
        id: 'uuid-123',
        email: loginDto.email,
        password: hashedPassword,
        role: 'CITIZEN',
        isActive: true,
      });
      mockPrismaService.user.update.mockResolvedValue({});
      mockJwtService.signAsync
        .mockResolvedValueOnce('access-token-mock')
        .mockResolvedValueOnce('refresh-token-mock');

      // Act
      const result = await service.login(loginDto);

      // Assert
      expect(result).toEqual({
        accessToken: 'access-token-mock',
        refreshToken: 'refresh-token-mock',
      });
    });

    it('devrait rejeter si l\'email n\'existe pas', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('devrait rejeter si le mot de passe est incorrect', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue({
        id: 'uuid-123',
        email: loginDto.email,
        password: await bcrypt.hash('wrong-password', 10),
        role: 'CITIZEN',
        isActive: true,
      });

      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('devrait rejeter si le compte est désactivé', async () => {
      const hashedPassword = await bcrypt.hash(loginDto.password, 10);
      mockPrismaService.user.findUnique.mockResolvedValue({
        id: 'uuid-123',
        email: loginDto.email,
        password: hashedPassword,
        role: 'CITIZEN',
        isActive: false,
      });

      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  // ══════════════════════════════════════════
  // LOGOUT
  // ══════════════════════════════════════════

  describe('logout', () => {
    it('devrait supprimer le refresh token', async () => {
      mockPrismaService.user.update.mockResolvedValue({});

      await service.logout('uuid-123');

      expect(mockPrismaService.user.update).toHaveBeenCalledWith({
        where: { id: 'uuid-123' },
        data: { refreshToken: null },
      });
    });
  });

  // ══════════════════════════════════════════
  // GET PROFILE
  // ══════════════════════════════════════════

  describe('getProfile', () => {
    it('devrait retourner le profil sans mot de passe ni refresh token', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue({
        id: 'uuid-123',
        email: 'test@senpolbank.sn',
        password: 'hashed-password',
        firstName: 'Amadou',
        lastName: 'Diallo',
        role: 'CITIZEN',
        isActive: true,
        refreshToken: 'hashed-refresh-token',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const profile = await service.getProfile('uuid-123');

      // Le profil ne doit PAS contenir le password et le refreshToken
      expect(profile).not.toHaveProperty('password');
      expect(profile).not.toHaveProperty('refreshToken');
      expect(profile).toHaveProperty('email', 'test@senpolbank.sn');
      expect(profile).toHaveProperty('firstName', 'Amadou');
    });

    it('devrait rejeter si l\'utilisateur n\'existe pas', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.getProfile('unknown-id')).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
