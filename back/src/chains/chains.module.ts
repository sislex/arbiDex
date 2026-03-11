import { Module } from '@nestjs/common';
import { ChainsService } from './chains.service';
import { ChainsController } from './chains.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tokens } from '../entities/main/entities/Tokens';
import { Chains } from '../entities/main/entities/Chains';
import { RpcUrls } from '../entities/main/entities/RpcUrls';

@Module({
  imports: [TypeOrmModule.forFeature([Tokens, Chains, RpcUrls])],
  controllers: [ChainsController],
  providers: [ChainsService],
  exports: [ChainsService],
})
export class ChainsModule {}
