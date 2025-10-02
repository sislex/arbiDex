import { forwardRef, Module } from '@nestjs/common';
import { ArbEvalsController } from './arb-evals.controller';
import { ArbEvalsService } from '../../db/services/arbEvals/arb-evals.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArbEvals } from '../../db/entities/ArbEvals';
import { ArbEvalsBackfillService } from './backfill.service';
import { QuotesModule } from '../quotes/quotes.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ArbEvals]),
    forwardRef(() => QuotesModule),
  ],
  controllers: [ArbEvalsController],
  providers: [ArbEvalsService, ArbEvalsBackfillService],
  exports: [ArbEvalsService],
})
export class ArbEvalsModule {}
