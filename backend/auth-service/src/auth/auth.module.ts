// ==============================================
// SenPolBank — Auth Module
// ==============================================
// Module NestJS qui assemble tous les composants
// d'authentification : service, controller, strategies,
// guards, et configuration JWT.
// ==============================================

import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { RolesGuard } from './guards/roles.guard';

@Module({
  imports: [
    // Passport pour les strategies d'authentification
    PassportModule.register({ defaultStrategy: 'jwt' }),

    // Configuration JWT — le secret est chargé depuis .env
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: '15m', // Access token expire en 15 minutes
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    JwtRefreshStrategy,
    RolesGuard,
  ],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
