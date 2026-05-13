import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CexChainsService } from './cex-chains.service';
import { CexChainsController } from './cex-chains.controller';
import { CexChain } from '../entities/entities/cex-chain.entity';
import { CexPair } from '../entities/entities/cex-pair.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([CexChain, CexPair])
  ],
  controllers: [CexChainsController],
  providers: [CexChainsService],
  exports: [CexChainsService],
})
export class CexChainsModule {}
