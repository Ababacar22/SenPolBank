import { Controller, Get, Patch, Param, Body, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Request } from 'express';
import { BankProxyService } from './bank-proxy.service';

@ApiTags('Banque (Gateway)')
@ApiBearerAuth()
@Controller('bank')
export class BankProxyController {
  constructor(private readonly bankProxy: BankProxyService) {}

  @Get('frauds')
  @ApiOperation({ summary: 'Fraudes en attente bancaire (proxy → bank-service)' })
  getPendingFrauds(@Req() req: Request) {
    return this.bankProxy.proxy('GET', '/bank/frauds', null, { authorization: req.headers.authorization || '' });
  }

  @Get('frauds/:id')
  @ApiOperation({ summary: 'Détail fraude (proxy → bank-service)' })
  getFraudDetail(@Param('id') id: string, @Req() req: Request) {
    return this.bankProxy.proxy('GET', `/bank/frauds/${id}`, null, { authorization: req.headers.authorization || '' });
  }

  @Patch('frauds/:id/resolve')
  @ApiOperation({ summary: 'Bloquer compte (proxy → bank-service)' })
  resolveFraud(@Param('id') id: string, @Body() body: any, @Req() req: Request) {
    return this.bankProxy.proxy('PATCH', `/bank/frauds/${id}/resolve`, body, { authorization: req.headers.authorization || '' });
  }

  @Patch('frauds/:id/reject')
  @ApiOperation({ summary: 'Rejeter côté banque (proxy → bank-service)' })
  rejectFraud(@Param('id') id: string, @Body() body: any, @Req() req: Request) {
    return this.bankProxy.proxy('PATCH', `/bank/frauds/${id}/reject`, body, { authorization: req.headers.authorization || '' });
  }
}
