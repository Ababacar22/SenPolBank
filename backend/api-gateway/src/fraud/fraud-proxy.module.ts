import { Module } from '@nestjs/common';
import { FraudProxyController } from './fraud-proxy.controller';
import { FraudProxyService } from './fraud-proxy.service';

@Module({
  controllers: [FraudProxyController],
  providers: [FraudProxyService],
})
export class FraudProxyModule {}
