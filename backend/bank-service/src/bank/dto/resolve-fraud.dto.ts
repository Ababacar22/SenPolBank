import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class ResolveFraudDto {
  @ApiPropertyOptional({ example: 'Compte bloqué. Remboursement en cours.', description: 'Note de l\'opérateur bancaire' })
  @IsOptional()
  @IsString()
  note?: string;
}
