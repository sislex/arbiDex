import { Module } from '@nestjs/common';
import { PairQuoteRelationsService } from './pair-quote-relations.service';
import { PairQuoteRelationsController } from './pair-quote-relations.controller';

@Module({
  controllers: [PairQuoteRelationsController],
  providers: [PairQuoteRelationsService],
})
export class PairQuoteRelationsModule {}
