// ==============================================
// SenPolBank — JWT Strategy (Access Token)
// ==============================================
// Passport strategy pour valider les access tokens.
//
// COMMENT ÇA MARCHE ?
// 1. Le client envoie "Authorization: Bearer <token>"
// 2. Passport extrait le token du header
// 3. Cette strategy vérifie la signature JWT
// 4. Si valide, elle retourne le payload (userId, email, role)
// 5. Le payload est disponible via @CurrentUser()
// ==============================================

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(configService: ConfigService) {
    super({
      // Extraire le token du header Authorization: Bearer <token>
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // Ne pas accepter les tokens expirés
      ignoreExpiration: false,
      // Clé secrète pour vérifier la signature
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  // Cette méthode est appelée APRÈS la vérification de la signature.
  // Son retour est injecté dans request.user
  async validate(payload: JwtPayload) {
    if (!payload.sub) {
      throw new UnauthorizedException('Token invalide');
    }
    return {
      sub: payload.sub,
      email: payload.email,
      role: payload.role,
    };
  }
}
