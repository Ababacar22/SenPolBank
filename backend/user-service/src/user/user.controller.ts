import { Controller, Get, Patch, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UserService } from './user.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { SubmitKycDto } from './dto/submit-kyc.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Role, KycStatus } from '@prisma/client';

@ApiTags('Utilisateurs')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // ──────────────────────────────────────────
  // ROUTES UTILISATEURS (Accessibles à tous connectés)
  // ──────────────────────────────────────────

  @Get('me')
  @ApiOperation({ summary: 'Consulter mon profil' })
  getProfile(@CurrentUser('sub') userId: string) {
    return this.userService.getProfile(userId);
  }

  @Patch('me')
  @ApiOperation({ summary: 'Mettre à jour mon profil' })
  updateProfile(@CurrentUser('sub') userId: string, @Body() dto: UpdateProfileDto) {
    return this.userService.updateProfile(userId, dto);
  }

  @Post('me/kyc')
  @ApiOperation({ summary: 'Soumettre son document d\'identité (KYC)' })
  submitKyc(@CurrentUser('sub') userId: string, @Body() dto: SubmitKycDto) {
    return this.userService.submitKyc(userId, dto);
  }

  // ──────────────────────────────────────────
  // ROUTES ADMIN (Restreintes)
  // ──────────────────────────────────────────

  @Get()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Lister tous les utilisateurs (Admin)' })
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Consulter un utilisateur (Admin)' })
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Patch(':id/role')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Changer le rôle d\'un utilisateur (Admin)' })
  updateRole(@Param('id') id: string, @Body() dto: UpdateRoleDto) {
    return this.userService.updateRole(id, dto.role);
  }

  @Patch(':id/status')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Suspendre/Activer un utilisateur (Admin)' })
  toggleStatus(@Param('id') id: string, @Body('isActive') isActive: boolean) {
    return this.userService.toggleStatus(id, isActive);
  }

  @Patch(':id/kyc')
  @Roles(Role.ADMIN, Role.POLICE) // La police peut aussi valider les KYC
  @ApiOperation({ summary: 'Valider/Rejeter le KYC d\'un utilisateur (Admin/Police)' })
  verifyKyc(@Param('id') id: string, @Body('status') status: KycStatus) {
    return this.userService.verifyKyc(id, status);
  }
}
