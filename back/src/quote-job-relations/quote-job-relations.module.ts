import { forwardRef, Module } from '@nestjs/common';
import { QuoteJobRelationsService } from './quote-job-relations.service';
import { QuoteJobRelationsController } from './quote-job-relations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Quotes } from '../entities/entities/Quotes';
import { QuotesModule } from '../quotes/quotes.module';
import { QuoteJobRelations } from '../entities/entities/QuoteJobRelations';
import { Jobs } from '../entities/entities/Jobs';
import { JobsModule } from '../jobs/jobs.module';
import { PairQuoteRelationsModule } from '../pair-quote-relations/pair-quote-relations.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Jobs, Quotes, QuoteJobRelations]),
    forwardRef(() => JobsModule),
    QuotesModule,
    PairQuoteRelationsModule,
  ],
  controllers: [QuoteJobRelationsController],
  providers: [QuoteJobRelationsService],
  exports: [QuoteJobRelationsService],
})
export class QuoteJobRelationsModule {}
