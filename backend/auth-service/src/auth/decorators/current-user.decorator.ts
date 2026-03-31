// ==============================================
// SenPolBank — CurrentUser Decorator
// ==============================================
// Décorateur pour extraire l'utilisateur courant
// (ou une propriété spécifique) du JWT payload.
//
// USAGE :
//   @CurrentUser()        → tout le payload {sub, email, role}
//   @CurrentUser('sub')   → juste l'ID utilisateur
//   @CurrentUser('role')  → juste le rôle
// ==============================================

import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    // Si une propriété spécifique est demandée
    if (data) {
      return user?.[data];
    }

    // Sinon, retourner tout le payload
    return user;
  },
);
