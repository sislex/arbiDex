import { Module } from '@nestjs/common';
import { MarketsService } from './markets.service';
import { MarketsController } from './markets.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pools } from '../entities/entities/Pools';
import { Markets } from '../entities/entities/Markets';

@Module({
  imports: [TypeOrmModule.forFeature([Pools, Markets])],
  controllers: [MarketsController],
  providers: [MarketsService],
  exports: [MarketsService],
})
export class MarketsModule {}
