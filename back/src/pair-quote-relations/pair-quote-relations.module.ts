import { Module } from '@nestjs/common';
import { PairQuoteRelationsService } from './pair-quote-relations.service';
import { PairQuoteRelationsController } from './pair-quote-relations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PairsModule } from '../pairs/pairs.module';
import { QuotesModule } from '../quotes/quotes.module';
import { Pairs } from '../entities/entities/Pairs';
import { Quotes } from '../entities/entities/Quotes';
import { PairQuoteRelations } from '../entities/entities/PairQuoteRelations';
import { TokensModule } from '../tokens/tokens.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Pairs, Quotes, PairQuoteRelations]),
    PairsModule,
    QuotesModule,
    TokensModule,
  ],
  controllers: [PairQuoteRelationsController],
  providers: [PairQuoteRelationsService],
  exports: [PairQuoteRelationsService],
})
export class PairQuoteRelationsModule {}
