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
import { FraudProxyModule } from './fraud/fraud-proxy.module';
import { PoliceProxyModule } from './police/police-proxy.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '../../.env',
    }),
    AuthProxyModule,
    UserProxyModule,
    FraudProxyModule,
    PoliceProxyModule,
    // Les futurs modules seront ajoutés ici :
    // BankProxyModule,
  ],
})
export class AppModule {}
