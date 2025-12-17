import { Module } from '@nestjs/common';
import { DexesService } from './dexes.service';
import { DexesController } from './dexes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pools } from '../entities/entities/Pools';
import { Dexes } from '../entities/entities/Dexes';

@Module({
  imports: [TypeOrmModule.forFeature([Dexes, Pools])],
  controllers: [DexesController],
  providers: [DexesService],
  exports: [DexesService],
})
export class DexesModule {}
