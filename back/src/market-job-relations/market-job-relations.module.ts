import { Module } from '@nestjs/common';
import { MarketJobRelationsService } from './market-job-relations.service';
import { MarketJobRelationsController } from './market-job-relations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MarketJobRelations } from '../entities/entities/MarketJobRelations';

@Module({
  imports: [TypeOrmModule.forFeature([MarketJobRelations])],
  controllers: [MarketJobRelationsController],
  providers: [MarketJobRelationsService],
})
export class MarketJobRelationsModule {}
