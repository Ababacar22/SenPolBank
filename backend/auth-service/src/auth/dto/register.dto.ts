// ==============================================
// SenPolBank — Register DTO
// ==============================================
// DTO (Data Transfer Object) pour l'inscription.
// class-validator valide automatiquement les champs
// grâce au ValidationPipe configuré dans main.ts.
//
// POURQUOI des DTOs ?
// - Validation automatique des entrées
// - Documentation Swagger générée automatiquement
// - Sécurité : seuls les champs déclarés sont acceptés
// ==============================================

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  Matches,
} from 'class-validator';

// On importe le Role directement depuis le schema Prisma
// pour garder une seule source de vérité
enum Role {
  CITIZEN = 'CITIZEN',
  POLICE = 'POLICE',
  BANK = 'BANK',
  ADMIN = 'ADMIN',
}

export class RegisterDto {
  @ApiProperty({ example: 'citoyen@senpolbank.sn', description: 'Email unique' })
  @IsEmail({}, { message: 'L\'email doit être valide' })
  @IsNotEmpty({ message: 'L\'email est obligatoire' })
  email: string;

  @ApiProperty({ example: 'MotDePasse123!', description: 'Minimum 8 caractères, 1 majuscule, 1 chiffre' })
  @IsString()
  @MinLength(8, { message: 'Le mot de passe doit contenir au moins 8 caractères' })
  @Matches(/^(?=.*[A-Z])(?=.*\d)/, {
    message: 'Le mot de passe doit contenir au moins 1 majuscule et 1 chiffre',
  })
  password: string;

  @ApiProperty({ example: 'Amadou', description: 'Prénom' })
  @IsString()
  @IsNotEmpty({ message: 'Le prénom est obligatoire' })
  firstName: string;

  @ApiProperty({ example: 'Diallo', description: 'Nom de famille' })
  @IsString()
  @IsNotEmpty({ message: 'Le nom est obligatoire' })
  lastName: string;

  @ApiPropertyOptional({ enum: Role, default: Role.CITIZEN, description: 'Rôle (défaut: CITIZEN)' })
  @IsOptional()
  @IsEnum(Role, { message: 'Le rôle doit être CITIZEN, POLICE, BANK ou ADMIN' })
  role?: Role;
}
