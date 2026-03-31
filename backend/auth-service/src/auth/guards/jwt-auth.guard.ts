// ==============================================
// SenPolBank — JWT Auth Guard
// ==============================================
// Guard qui protège les routes nécessitant un
// access token valide.
//
// USAGE :
//   @UseGuards(JwtAuthGuard)
//   @Get('profile')
//   getProfile() { ... }
// ==============================================

import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
