import { Controller, Get, Patch, Post, Body, Param, Req, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Request } from 'express';
import { UserProxyService } from './user-proxy.service';

@ApiTags('Users (Gateway)')
@ApiBearerAuth()
@Controller('users')
export class UserProxyController {
  constructor(private readonly userProxy: UserProxyService) {}

  @Get('me')
  @ApiOperation({ summary: 'Mon profil (proxy → user-service)' })
  getProfile(@Req() req: Request) {
    return this.userProxy.proxy('GET', '/users/me', null, {
      authorization: req.headers.authorization || '',
    });
  }

  @Patch('me')
  @ApiOperation({ summary: 'Mettre à jour mon profil (proxy → user-service)' })
  updateProfile(@Body() body: any, @Req() req: Request) {
    return this.userProxy.proxy('PATCH', '/users/me', body, {
      authorization: req.headers.authorization || '',
    });
  }

  @Post('me/kyc')
  @ApiOperation({ summary: 'Soumettre document KYC (proxy → user-service)' })
  submitKyc(@Body() body: any, @Req() req: Request) {
    return this.userProxy.proxy('POST', '/users/me/kyc', body, {
      authorization: req.headers.authorization || '',
    });
  }

  @Get()
  @ApiOperation({ summary: 'Lister les utilisateurs [ADMIN] (proxy → user-service)' })
  findAll(@Req() req: Request) {
    return this.userProxy.proxy('GET', '/users', null, {
      authorization: req.headers.authorization || '',
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Consulter un utilisateur [ADMIN] (proxy → user-service)' })
  findOne(@Param('id') id: string, @Req() req: Request) {
    return this.userProxy.proxy('GET', `/users/${id}`, null, {
      authorization: req.headers.authorization || '',
    });
  }

  @Patch(':id/role')
  @ApiOperation({ summary: 'Changer le rôle [ADMIN] (proxy → user-service)' })
  updateRole(@Param('id') id: string, @Body() body: any, @Req() req: Request) {
    return this.userProxy.proxy('PATCH', `/users/${id}/role`, body, {
      authorization: req.headers.authorization || '',
    });
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Suspendre/Activer [ADMIN] (proxy → user-service)' })
  toggleStatus(@Param('id') id: string, @Body() body: any, @Req() req: Request) {
    return this.userProxy.proxy('PATCH', `/users/${id}/status`, body, {
      authorization: req.headers.authorization || '',
    });
  }

  @Patch(':id/kyc')
  @ApiOperation({ summary: 'Valider/Rejeter KYC [ADMIN/POLICE] (proxy → user-service)' })
  verifyKyc(@Param('id') id: string, @Body() body: any, @Req() req: Request) {
    return this.userProxy.proxy('PATCH', `/users/${id}/kyc`, body, {
      authorization: req.headers.authorization || '',
    });
  }
}
