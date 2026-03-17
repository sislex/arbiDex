import { Module } from '@nestjs/common';
import { QuotesGraphService } from './quotes_graph.service';
import { QuotesGraphController } from './quotes_graph.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([], 'analytics')],
  controllers: [QuotesGraphController],
  providers: [QuotesGraphService],
})
export class QuotesGraphModule {}
