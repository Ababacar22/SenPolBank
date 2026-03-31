import { Module } from '@nestjs/common';
import { BankProxyController } from './bank-proxy.controller';
import { BankProxyService } from './bank-proxy.service';

@Module({
  controllers: [BankProxyController],
  providers: [BankProxyService],
})
export class BankProxyModule {}
