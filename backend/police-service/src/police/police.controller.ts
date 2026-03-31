import { Controller, Get, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PoliceService } from './police.service';
import { ValidateFraudDto } from './dto/validate-fraud.dto';
import { RejectFraudDto } from './dto/reject-fraud.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Role } from '@prisma/client';

@ApiTags('Police')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.POLICE, Role.ADMIN)
@Controller('police')
export class PoliceController {
  constructor(private readonly policeService: PoliceService) {}

  @Get('frauds')
  @ApiOperation({ summary: 'Lister les signalements en attente de validation' })
  getPendingFrauds() {
    return this.policeService.getPendingFrauds();
  }

  @Get('frauds/:id')
  @ApiOperation({ summary: 'Détail d\'un signalement' })
  getFraudDetail(@Param('id') id: string) {
    return this.policeService.getFraudDetail(id);
  }

  @Patch('frauds/:id/validate')
  @Roles(Role.POLICE)
  @ApiOperation({ summary: 'Valider un signalement → Transmis à la banque' })
  validateFraud(
    @CurrentUser('sub') policeId: string,
    @Param('id') fraudId: string,
    @Body() dto: ValidateFraudDto,
  ) {
    return this.policeService.validateFraud(policeId, fraudId, dto.note);
  }

  @Patch('frauds/:id/reject')
  @Roles(Role.POLICE)
  @ApiOperation({ summary: 'Rejeter un signalement' })
  rejectFraud(
    @CurrentUser('sub') policeId: string,
    @Param('id') fraudId: string,
    @Body() dto: RejectFraudDto,
  ) {
    return this.policeService.rejectFraud(policeId, fraudId, dto.reason);
  }
}
