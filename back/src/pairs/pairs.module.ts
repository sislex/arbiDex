import { Module } from '@nestjs/common';
import { PairsService } from './pairs.service';
import { PairsController } from './pairs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pairs } from '../entities/entities/Pairs';
import { Pools } from '../entities/entities/Pools';
import { PoolsModule } from '../pools/pools.module';

@Module({
  imports: [TypeOrmModule.forFeature([Pairs, Pools]), PoolsModule],
  controllers: [PairsController],
  providers: [PairsService],
  exports: [PairsService],
})
export class PairsModule {}
