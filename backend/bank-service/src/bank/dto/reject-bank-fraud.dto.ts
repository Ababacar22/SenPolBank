import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RejectBankFraudDto {
  @ApiProperty({ example: 'Compte non trouvé dans notre système.', description: 'Motif de rejet bancaire' })
  @IsString()
  @IsNotEmpty()
  note: string;
}
