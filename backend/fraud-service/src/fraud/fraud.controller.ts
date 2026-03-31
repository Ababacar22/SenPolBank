import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { FraudService } from './fraud.service';
import { ReportFraudDto } from './dto/report-fraud.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Role } from '@prisma/client';

@ApiTags('Fraudes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('frauds')
export class FraudController {
  constructor(private readonly fraudService: FraudService) {}

  // ──────────────────────────────────────────
  // CITOYENS
  // ──────────────────────────────────────────

  @Post()
  @Roles(Role.CITIZEN)
  @ApiOperation({ summary: 'Signaler une fraude (Citoyen)' })
  reportFraud(
    @CurrentUser('sub') citizenId: string,
    @Body() dto: ReportFraudDto,
  ) {
    return this.fraudService.reportFraud(citizenId, dto);
  }

  @Get('me')
  @Roles(Role.CITIZEN)
  @ApiOperation({ summary: 'Lister mes signalements (Citoyen)' })
  findMyFrauds(@CurrentUser('sub') citizenId: string) {
    return this.fraudService.findMyFrauds(citizenId);
  }

  @Get('me/:id')
  @Roles(Role.CITIZEN)
  @ApiOperation({ summary: 'Voir les détails de mon signalement (Citoyen)' })
  getFraudDetails(
    @CurrentUser('sub') citizenId: string,
    @Param('id') fraudId: string,
  ) {
    return this.fraudService.getFraudDetails(citizenId, fraudId);
  }

  // ──────────────────────────────────────────
  // POLICE / ADMIN
  // ──────────────────────────────────────────

  @Get('pending')
  @Roles(Role.POLICE, Role.ADMIN)
  @ApiOperation({ summary: 'Lister les signalements en attente (Police/Admin)' })
  findAllPending() {
    return this.fraudService.findAllPending();
  }
}
