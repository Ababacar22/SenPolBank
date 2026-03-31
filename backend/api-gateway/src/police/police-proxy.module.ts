import { Module } from '@nestjs/common';
import { PoliceProxyController } from './police-proxy.controller';
import { PoliceProxyService } from './police-proxy.service';

@Module({
  controllers: [PoliceProxyController],
  providers: [PoliceProxyService],
})
export class PoliceProxyModule {}
