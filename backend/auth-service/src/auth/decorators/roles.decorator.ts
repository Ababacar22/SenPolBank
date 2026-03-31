// ==============================================
// SenPolBank — Roles Decorator
// ==============================================
// Décorateur custom pour spécifier les rôles requis.
//
// USAGE :
//   @Roles('POLICE', 'ADMIN')
//   @Get('police-dashboard')
//   getPoliceDashboard() { ... }
// ==============================================

import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
