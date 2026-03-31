import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsPhoneNumber } from 'class-validator';

export class UpdateProfileDto {
  @ApiPropertyOptional({ example: 'Amadou', description: 'Prénom' })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiPropertyOptional({ example: 'Diallo', description: 'Nom de famille' })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiPropertyOptional({ example: '+221770000000', description: 'Numéro de téléphone' })
  @IsOptional()
  @IsPhoneNumber()
  phoneNumber?: string;
}
