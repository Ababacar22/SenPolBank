// ==============================================
// SenPolBank — Auth Proxy Controller
// ==============================================
// Routes du gateway qui proxifient vers le Auth Service.
// Le client appelle : POST /api/auth/register
// Le gateway transfère vers : POST auth-service:3001/auth/register
// ==============================================

import {
  Controller,
  Post,
  Get,
  Body,
  Req,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Request } from 'express';
import { AuthProxyService } from './auth-proxy.service';

@ApiTags('Auth (Gateway)')
@Controller('auth')
export class AuthProxyController {
  constructor(private readonly authProxy: AuthProxyService) {}

  @Post('register')
  @ApiOperation({ summary: 'Inscription (proxy → auth-service)' })
  async register(@Body() body: any) {
    return this.authProxy.proxy('POST', '/auth/register', body);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Connexion (proxy → auth-service)' })
  async login(@Body() body: any) {
    return this.authProxy.proxy('POST', '/auth/login', body);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Rafraîchir le token (proxy → auth-service)' })
  async refresh(@Body() body: any, @Req() req: Request) {
    return this.authProxy.proxy('POST', '/auth/refresh', body, {
      authorization: req.headers.authorization || '',
    });
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Déconnexion (proxy → auth-service)' })
  async logout(@Req() req: Request) {
    return this.authProxy.proxy('POST', '/auth/logout', null, {
      authorization: req.headers.authorization || '',
    });
  }

  @Get('profile')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Profil utilisateur (proxy → auth-service)' })
  async profile(@Req() req: Request) {
    return this.authProxy.proxy('GET', '/auth/profile', null, {
      authorization: req.headers.authorization || '',
    });
  }
}
