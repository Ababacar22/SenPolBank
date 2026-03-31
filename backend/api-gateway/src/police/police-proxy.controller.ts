import { Controller, Get, Patch, Param, Body, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Request } from 'express';
import { PoliceProxyService } from './police-proxy.service';

@ApiTags('Police (Gateway)')
@ApiBearerAuth()
@Controller('police')
export class PoliceProxyController {
  constructor(private readonly policeProxy: PoliceProxyService) {}

  @Get('frauds')
  @ApiOperation({ summary: 'Signalements en attente (proxy → police-service)' })
  getPendingFrauds(@Req() req: Request) {
    return this.policeProxy.proxy('GET', '/police/frauds', null, {
      authorization: req.headers.authorization || '',
    });
  }

  @Get('frauds/:id')
  @ApiOperation({ summary: 'Détail d\'un signalement (proxy → police-service)' })
  getFraudDetail(@Param('id') id: string, @Req() req: Request) {
    return this.policeProxy.proxy('GET', `/police/frauds/${id}`, null, {
      authorization: req.headers.authorization || '',
    });
  }

  @Patch('frauds/:id/validate')
  @ApiOperation({ summary: 'Valider un signalement (proxy → police-service)' })
  validateFraud(@Param('id') id: string, @Body() body: any, @Req() req: Request) {
    return this.policeProxy.proxy('PATCH', `/police/frauds/${id}/validate`, body, {
      authorization: req.headers.authorization || '',
    });
  }

  @Patch('frauds/:id/reject')
  @ApiOperation({ summary: 'Rejeter un signalement (proxy → police-service)' })
  rejectFraud(@Param('id') id: string, @Body() body: any, @Req() req: Request) {
    return this.policeProxy.proxy('PATCH', `/police/frauds/${id}/reject`, body, {
      authorization: req.headers.authorization || '',
    });
  }
}
