// ==============================================
// SenPolBank — Roles Guard
// ==============================================
// Guard qui vérifie que l'utilisateur connecté a
// le rôle requis pour accéder à la route.
//
// USAGE :
//   @UseGuards(JwtAuthGuard, RolesGuard)
//   @Roles(Role.POLICE, Role.ADMIN)
//   @Get('dashboard')
//   getDashboard() { ... }
//
// COMMENT ÇA MARCHE :
// 1. @Roles() décore la route avec les rôles autorisés
// 2. Ce guard lit les rôles via Reflector
// 3. Il compare avec le rôle de l'utilisateur dans le JWT
// 4. Si le rôle ne correspond pas → 403 Forbidden
// ==============================================

import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Récupérer les rôles requis définis par @Roles()
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // Si pas de @Roles() sur la route → accès libre
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    // Récupérer l'utilisateur injecté par le JwtAuthGuard
    const { user } = context.switchToHttp().getRequest();

    // Vérifier si le rôle de l'utilisateur est dans la liste
    return requiredRoles.includes(user.role);
  }
}
