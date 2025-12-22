import { Module } from '@nestjs/common';
import { QuoteJobRelationsService } from './quote-job-relations.service';
import { QuoteJobRelationsController } from './quote-job-relations.controller';

@Module({
  controllers: [QuoteJobRelationsController],
  providers: [QuoteJobRelationsService],
})
export class QuoteJobRelationsModule {}
