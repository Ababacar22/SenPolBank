import { Controller, Get, Post, Body, Param, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Request } from 'express';
import { FraudProxyService } from './fraud-proxy.service';

@ApiTags('Fraudes (Gateway)')
@ApiBearerAuth()
@Controller('frauds')
export class FraudProxyController {
  constructor(private readonly fraudProxy: FraudProxyService) {}

  @Post()
  @ApiOperation({ summary: 'Signaler une fraude (proxy → fraud-service)' })
  reportFraud(@Body() body: any, @Req() req: Request) {
    return this.fraudProxy.proxy('POST', '/frauds', body, {
      authorization: req.headers.authorization || '',
    });
  }

  @Get('me')
  @ApiOperation({ summary: 'Lister mes signalements (proxy → fraud-service)' })
  findMyFrauds(@Req() req: Request) {
    return this.fraudProxy.proxy('GET', '/frauds/me', null, {
      authorization: req.headers.authorization || '',
    });
  }

  @Get('me/:id')
  @ApiOperation({ summary: 'Détails de mon signalement (proxy → fraud-service)' })
  getFraudDetails(@Param('id') id: string, @Req() req: Request) {
    return this.fraudProxy.proxy('GET', `/frauds/me/${id}`, null, {
      authorization: req.headers.authorization || '',
    });
  }

  @Get('pending')
  @ApiOperation({ summary: 'Lister les signalements en attente [POLICE] (proxy → fraud-service)' })
  findAllPending(@Req() req: Request) {
    return this.fraudProxy.proxy('GET', '/frauds/pending', null, {
      authorization: req.headers.authorization || '',
    });
  }
}
