import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RejectFraudDto {
  @ApiProperty({ example: 'Informations insuffisantes pour confirmer la fraude.', description: 'Motif de rejet' })
  @IsString()
  @IsNotEmpty()
  reason: string;
}
