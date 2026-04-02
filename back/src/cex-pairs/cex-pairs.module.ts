import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CexPairsService } from './cex-pairs.service';
import { CexPairsController } from './cex-pairs.controller';
import { CexPair } from '../entities/entities/cex-pair.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([CexPair])
  ],
  controllers: [CexPairsController],
  providers: [CexPairsService],
  exports: [CexPairsService],
})
export class CexPairsModule {}
