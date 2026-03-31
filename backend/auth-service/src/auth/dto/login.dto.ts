// ==============================================
// SenPolBank — Login DTO
// ==============================================
// DTO pour la connexion. Seuls email et mot de passe
// sont nécessaires.
// ==============================================

import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'citoyen@senpolbank.sn', description: 'Email' })
  @IsEmail({}, { message: 'L\'email doit être valide' })
  @IsNotEmpty({ message: 'L\'email est obligatoire' })
  email: string;

  @ApiProperty({ example: 'MotDePasse123!', description: 'Mot de passe' })
  @IsString()
  @IsNotEmpty({ message: 'Le mot de passe est obligatoire' })
  password: string;
}
