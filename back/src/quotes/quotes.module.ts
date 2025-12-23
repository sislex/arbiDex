import { Module } from '@nestjs/common';
import { QuotesService } from './quotes.service';
import { QuotesController } from './quotes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Quotes } from '../entities/entities/Quotes';

@Module({
  imports: [TypeOrmModule.forFeature([Quotes])],
  controllers: [QuotesController],
  providers: [QuotesService],
})
export class QuotesModule {}
