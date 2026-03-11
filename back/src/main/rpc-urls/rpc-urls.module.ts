import { Module } from '@nestjs/common';
import { RpcUrlsService } from './rpc-urls.service';
import { RpcUrlsController } from './rpc-urls.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chains } from '../../entities/main/entities/Chains';
import { ChainsModule } from '../chains/chains.module';
import { RpcUrls } from '../../entities/main/entities/RpcUrls';

@Module({
  imports: [TypeOrmModule.forFeature([RpcUrls, Chains]), ChainsModule],
  controllers: [RpcUrlsController],
  providers: [RpcUrlsService],
  exports: [RpcUrlsService],
})
export class RpcUrlsModule {}
