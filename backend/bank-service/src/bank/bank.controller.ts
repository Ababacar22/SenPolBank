import { Controller, Get, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { BankService } from './bank.service';
import { ResolveFraudDto } from './dto/resolve-fraud.dto';
import { RejectBankFraudDto } from './dto/reject-bank-fraud.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Role } from '@prisma/client';

@ApiTags('Banque')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.BANK, Role.ADMIN)
@Controller('bank')
export class BankController {
  constructor(private readonly bankService: BankService) {}

  @Get('frauds')
  @ApiOperation({ summary: 'Fraudes en attente d\'action bancaire' })
  getPendingFrauds() {
    return this.bankService.getPendingFrauds();
  }

  @Get('frauds/:id')
  @ApiOperation({ summary: 'Détail d\'une fraude' })
  getFraudDetail(@Param('id') id: string) {
    return this.bankService.getFraudDetail(id);
  }

  @Patch('frauds/:id/resolve')
  @Roles(Role.BANK)
  @ApiOperation({ summary: 'Bloquer le compte et résoudre la fraude' })
  resolveFraud(
    @CurrentUser('sub') bankUserId: string,
    @Param('id') fraudId: string,
    @Body() dto: ResolveFraudDto,
  ) {
    return this.bankService.resolveFraud(bankUserId, fraudId, dto.note);
  }

  @Patch('frauds/:id/reject')
  @Roles(Role.BANK)
  @ApiOperation({ summary: 'Rejeter le dossier côté banque' })
  rejectFraud(
    @CurrentUser('sub') bankUserId: string,
    @Param('id') fraudId: string,
    @Body() dto: RejectBankFraudDto,
  ) {
    return this.bankService.rejectFraud(bankUserId, fraudId, dto.note);
  }
}
