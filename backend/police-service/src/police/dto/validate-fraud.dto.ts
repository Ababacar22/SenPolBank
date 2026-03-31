import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class ValidateFraudDto {
  @ApiPropertyOptional({ example: 'Fraude confirmée après vérification auprès de la banque.', description: 'Note de l\'agent' })
  @IsOptional()
  @IsString()
  note?: string;
}
