import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class SubmitKycDto {
  @ApiProperty({ example: 'SN123456789', description: 'Numéro de Carte d\'Identité ou Passeport' })
  @IsString()
  @IsNotEmpty()
  nationalId: string;
}
