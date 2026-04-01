import { Module } from '@nestjs/common';
import { CexPoolsService } from './cex-pools.service';
import { CexPoolsController } from './cex-pools.controller';

@Module({
  controllers: [CexPoolsController],
  providers: [CexPoolsService],
})
export class CexPoolsModule {}
