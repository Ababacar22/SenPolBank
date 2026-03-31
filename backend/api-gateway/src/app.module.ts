// ==============================================
// SenPolBank — API Gateway — App Module
// ==============================================
// Module racine du gateway. Importe les modules
// proxy pour chaque microservice.
// ==============================================

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthProxyModule } from './auth/auth-proxy.module';
import { UserProxyModule } from './user/user-proxy.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '../../.env',
    }),
    AuthProxyModule,
    UserProxyModule,
    // Les futurs modules seront ajoutés ici :
    // FraudProxyModule,
    // PoliceProxyModule,
    // BankProxyModule,
  ],
})
export class AppModule {}
