import { Module } from '@nestjs/common';
import { PoolsService } from './pools.service';
import { PoolsController } from './pools.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pools } from '../entities/entities/Pools';
import { Dexes } from '../entities/entities/Dexes';
import { Markets } from '../entities/entities/Markets';
import { Chains } from '../entities/entities/Chains';
import { TokensModule } from '../tokens/tokens.module';
import { Tokens } from '../entities/entities/Tokens';
import { ChainsModule } from '../chains/chains.module';
import { DexesModule } from '../dexes/dexes.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Pools, Dexes, Tokens, Markets, Chains]),
    TokensModule,
    ChainsModule,
    DexesModule,
  ],
  controllers: [PoolsController],
  providers: [PoolsService],
  exports: [PoolsService],
})
export class PoolsModule {}
