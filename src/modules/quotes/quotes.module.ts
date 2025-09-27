import { Module } from '@nestjs/common';
import { QuotesController } from './quotes.controller';
import { QuotesService } from '../../db/services/quotes/quotes.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Quotes } from '../../db/entities/Quotes';

@Module({
  imports: [TypeOrmModule.forFeature([Quotes])],
  controllers: [QuotesController],
  providers: [QuotesService],
  exports: [QuotesService, TypeOrmModule],
})
export class QuotesModule {}
