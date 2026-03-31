import { Module } from '@nestjs/common';
import { PoliceService } from './police.service';
import { PoliceController } from './police.controller';

@Module({
  controllers: [PoliceController],
  providers: [PoliceService],
})
export class PoliceModule {}
