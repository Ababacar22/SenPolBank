// ==============================================
// SenPolBank — JWT Refresh Guard
// ==============================================
// Guard pour les routes de refresh token.
// Utilise la strategy 'jwt-refresh' au lieu de 'jwt'.
// ==============================================

import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtRefreshGuard extends AuthGuard('jwt-refresh') {}
