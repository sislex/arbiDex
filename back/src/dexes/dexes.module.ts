import { Module } from '@nestjs/common';
import { DexesService } from './dexes.service';
import { DexesController } from './dexes.controller';

@Module({
  controllers: [DexesController],
  providers: [DexesService],
})
export class DexesModule {}
