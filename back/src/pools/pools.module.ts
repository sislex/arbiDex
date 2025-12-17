import { Module } from '@nestjs/common';
import { PoolsService } from './pools.service';
import { PoolsController } from './pools.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pools } from '../entities/entities/Pools';
import { Dexes } from '../entities/entities/Dexes';
import { Markets } from '../entities/entities/Markets';
import { Tokens } from '../entities/entities/Tokens';
import { Chains } from '../entities/entities/Chains';

@Module({
  imports: [TypeOrmModule.forFeature([Pools, Dexes, Markets, Tokens, Chains])],
  controllers: [PoolsController],
  providers: [PoolsService],
  exports: [PoolsService],
})
export class PoolsModule {}
