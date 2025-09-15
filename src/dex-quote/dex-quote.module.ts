import { Module } from '@nestjs/common';
import { DexFactoryService } from './dex-factory.service';

@Module({
  providers: [DexFactoryService],
  exports: [DexFactoryService],
})
export class DexQuoteModule {}
