import { Module } from '@nestjs/common';
import { CexChainsService } from './cex-chains.service';
import { CexChainsController } from './cex-chains.controller';

@Module({
  controllers: [CexChainsController],
  providers: [CexChainsService],
})
export class CexChainsModule {}
