import { Module } from '@nestjs/common';
import { RpcUrlsService } from './rpc-urls.service';
import { RpcUrlsController } from './rpc-urls.controller';

@Module({
  controllers: [RpcUrlsController],
  providers: [RpcUrlsService],
})
export class RpcUrlsModule {}
