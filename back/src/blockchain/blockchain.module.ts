import { Module } from '@nestjs/common';
import { BlockchainService } from './blockchain.service';
import { BlockchainController } from './blockchain.controller';
import { Pools } from '../entities/entities/Pools';
import { Tokens } from '../entities/entities/Tokens';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PoolsModule } from '../pools/pools.module';
import { TokensModule } from 'src/tokens/tokens.module';
import { GetV2ReservesHelper } from '../-helpers/getV2Reserves';
import { GetV3ReservesHelper } from '../-helpers/getV3Reserves';

@Module({
  imports: [
    TypeOrmModule.forFeature([Pools, Tokens]),
    PoolsModule,
    TokensModule,
  ],
  controllers: [BlockchainController],
  providers: [
    BlockchainService,
    GetV2ReservesHelper,
    GetV3ReservesHelper
  ],
  exports: [BlockchainService],
})
export class BlockchainModule {}