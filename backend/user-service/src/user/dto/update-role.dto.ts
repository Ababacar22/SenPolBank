import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { Role } from '@prisma/client';

export class UpdateRoleDto {
  @ApiProperty({ enum: Role, description: 'Nouveau rôle de l\'utilisateur' })
  @IsEnum(Role)
  @IsNotEmpty()
  role: Role;
}
