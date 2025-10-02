import { forwardRef, Module } from '@nestjs/common';
import { QuotesController } from './quotes.controller';
import { QuotesService } from '../../db/services/quotes/quotes.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Quotes } from '../../db/entities/Quotes';
import { ArbEvalsModule } from '../arb-evals/arb-evals.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Quotes]),
    forwardRef(() => ArbEvalsModule),
  ],
  controllers: [QuotesController],
  providers: [QuotesService],
  exports: [QuotesService],
})
export class QuotesModule {}
