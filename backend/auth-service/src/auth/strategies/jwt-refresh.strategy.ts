// ==============================================
// SenPolBank — JWT Refresh Strategy
// ==============================================
// Strategy Passport pour le refresh token.
// Différente de la strategy JWT standard :
// - Utilise un secret différent (JWT_SECRET + '_refresh')
// - Passe le refresh token brut au controller
//   pour vérification contre le hash en BDD
// ==============================================

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') + '_refresh',
      // passReqToCallback = true → on reçoit le request en paramètre
      // pour pouvoir extraire le refresh token brut
      passReqToCallback: true,
    });
  }

  // Retourne le payload + le refresh token brut
  async validate(req: Request, payload: { sub: string; email: string; role: string }) {
    const refreshToken = req.get('Authorization')?.replace('Bearer ', '').trim();
    return {
      sub: payload.sub,
      email: payload.email,
      role: payload.role,
      refreshToken, // Passé au controller via @CurrentUser('refreshToken')
    };
  }
}
