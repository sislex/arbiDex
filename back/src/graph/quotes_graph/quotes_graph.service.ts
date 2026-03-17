import { Injectable } from '@nestjs/common';
import { CreateQuotesGraphDto } from '../../dtos/quotes_graph/create-quotes_graph.dto';
import { UpdateQuotesGraphDto } from '../../dtos/quotes_graph/update-quotes_graph.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { QuotesGraph } from '../../entities/analytics/entities/QuotesGraph';
import { Repository } from 'typeorm';

@Injectable()
export class QuotesGraphService {
  constructor(
    @InjectRepository(QuotesGraph, 'analytics')
    private quotesGraphRepo: Repository<QuotesGraph>,
  ) {}

  findAll() {
    return `This action returns all quotesGraph`;
  }

  findByRange(range: number) {
  }
}
