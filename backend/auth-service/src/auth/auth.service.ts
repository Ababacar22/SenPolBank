// ==============================================
// SenPolBank — Auth Service (Business Logic)
// ==============================================
// Ce service contient toute la logique métier
// de l'authentification :
//
// 1. register() — Inscription d'un nouvel utilisateur
// 2. login()    — Connexion et génération des tokens
// 3. refreshTokens() — Renouvellement du access token
// 4. logout()   — Invalidation du refresh token
//
// SÉCURITÉ :
// - Mots de passe hashés avec bcrypt (10 rounds)
// - Refresh tokens hashés avant stockage en BDD
// - Access token court (15min), refresh token long (7j)
// ==============================================

import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

// Type retourné après login/register
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

// Payload stocké dans le JWT
export interface JwtPayload {
  sub: string;   // user ID
  email: string;
  role: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  // ──────────────────────────────────────────
  // REGISTER — Inscription
  // ──────────────────────────────────────────
  // 1. Vérifie que l'email n'existe pas déjà
  // 2. Hash le mot de passe avec bcrypt
  // 3. Crée l'utilisateur en BDD
  // 4. Génère et retourne les tokens JWT
  // ──────────────────────────────────────────
  async register(dto: RegisterDto): Promise<AuthTokens> {
    // Vérifier si l'email est déjà utilisé
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new ConflictException('Cet email est déjà utilisé');
    }

    // Hasher le mot de passe (bcrypt, 10 rounds de salage)
    // POURQUOI 10 rounds ? C'est le standard recommandé :
    // assez lent pour résister aux attaques brute-force,
    // assez rapide pour ne pas bloquer le serveur
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // Créer l'utilisateur en base
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        firstName: dto.firstName,
        lastName: dto.lastName,
        role: dto.role || 'CITIZEN',
      },
    });

    // Générer les tokens JWT
    const tokens = await this.generateTokens({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    // Stocker le refresh token hashé en BDD
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }

  // ──────────────────────────────────────────
  // LOGIN — Connexion
  // ──────────────────────────────────────────
  // 1. Cherche l'utilisateur par email
  // 2. Compare le mot de passe avec le hash
  // 3. Génère et retourne les tokens JWT
  // ──────────────────────────────────────────
  async login(dto: LoginDto): Promise<AuthTokens> {
    // Chercher l'utilisateur
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      // Message volontairement vague pour la sécurité
      // (ne pas révéler si l'email existe ou non)
      throw new UnauthorizedException('Email ou mot de passe incorrect');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Ce compte a été désactivé');
    }

    // Comparer le mot de passe avec le hash stocké
    const isPasswordValid = await bcrypt.compare(dto.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Email ou mot de passe incorrect');
    }

    // Générer les tokens
    const tokens = await this.generateTokens({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    // Mettre à jour le refresh token en BDD
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }

  // ──────────────────────────────────────────
  // REFRESH — Renouvellement du token
  // ──────────────────────────────────────────
  // Le client envoie son refresh token pour obtenir
  // un nouveau access token sans se reconnecter.
  //
  // POURQUOI ? Le access token expire vite (15min)
  // pour limiter les dégâts en cas de vol. Le refresh
  // token permet de renouveler sans redemander le
  // mot de passe.
  // ──────────────────────────────────────────
  async refreshTokens(userId: string, refreshToken: string): Promise<AuthTokens> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.refreshToken) {
      throw new ForbiddenException('Accès refusé');
    }

    // Comparer le refresh token envoyé avec le hash en BDD
    const isRefreshTokenValid = await bcrypt.compare(
      refreshToken,
      user.refreshToken,
    );

    if (!isRefreshTokenValid) {
      throw new ForbiddenException('Refresh token invalide');
    }

    // Générer de nouveaux tokens (rotation)
    const tokens = await this.generateTokens({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }

  // ──────────────────────────────────────────
  // LOGOUT — Déconnexion
  // ──────────────────────────────────────────
  // Supprime le refresh token de la BDD.
  // Le access token actuel reste valide jusqu'à
  // expiration (15min max).
  // ──────────────────────────────────────────
  async logout(userId: string): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });
  }

  // ──────────────────────────────────────────
  // GET PROFILE — Récupérer le profil
  // ──────────────────────────────────────────
  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('Utilisateur non trouvé');
    }

    // Ne jamais renvoyer le mot de passe ni le refresh token
    const { password, refreshToken, ...profile } = user;
    return profile;
  }

  // ══════════════════════════════════════════
  // MÉTHODES PRIVÉES (helpers internes)
  // ══════════════════════════════════════════

  // Génère un access token (15min) et un refresh token (7j)
  private async generateTokens(payload: JwtPayload): Promise<AuthTokens> {
    const [accessToken, refreshToken] = await Promise.all([
      // Access token — courte durée
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: '15m',
      }),
      // Refresh token — longue durée
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_SECRET') + '_refresh',
        expiresIn: '7d',
      }),
    ]);

    return { accessToken, refreshToken };
  }

  // Hash et stocke le refresh token en BDD
  // POURQUOI hasher ? Si la BDD est compromise, les tokens
  // stockés en clair pourraient être utilisés directement
  private async updateRefreshToken(userId: string, refreshToken: string): Promise<void> {
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: hashedRefreshToken },
    });
  }
}
