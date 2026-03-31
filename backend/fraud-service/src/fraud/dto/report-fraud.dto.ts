import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, IsOptional, Min } from 'class-validator';

export class ReportFraudDto {
  @ApiProperty({ example: 'Transaction non autorisée sur ma carte', description: 'Titre du signalement' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'J\'ai remarqué un retrait de 50 000 FCFA que je n\'ai pas effectué...', description: 'Description détaillée' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 'Ecobank', description: 'Nom de la banque concernée' })
  @IsString()
  @IsNotEmpty()
  bankName: string;

  @ApiProperty({ example: 'SN0123456789', description: 'Numéro de compte ou IBAN' })
  @IsString()
  @IsNotEmpty()
  bankAccount: string;

  @ApiPropertyOptional({ example: 50000, description: 'Montant de la fraude estimé' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  amount?: number;
}
