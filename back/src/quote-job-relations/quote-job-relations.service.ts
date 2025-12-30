import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QuotesService } from '../quotes/quotes.service';
import { JobsService } from '../jobs/jobs.service';
import { QuoteJobRelations } from '../entities/entities/QuoteJobRelations';

@Injectable()
export class QuoteJobRelationsService {
  constructor(
    @InjectRepository(QuoteJobRelations)
    private quoteJobRelationsRepository: Repository<QuoteJobRelations>,
    private jobsService: JobsService,
    private quotesService: QuotesService,
  ) {}

  async findByQuoteId(id: string) {
    const item = await this.quoteJobRelationsRepository.findOne({
      where: {
        quoteRelation: {
          quote: {
            quoteId: id,
          },
        },
      },
      relations: [
        'job',
        'quoteRelation',
        'quoteRelation.quote',
        'quoteRelation.pair',
        'quoteRelation.pair.tokenIn',
        'quoteRelation.pair.tokenOut',
        'quoteRelation.pair.pool',
        'quoteRelation.pair.pool.dex',
        'quoteRelation.pair.pool.chain',
        'quoteRelation.pair.pool.token',
        'quoteRelation.pair.pool.token2',
      ],
    });

    if (!item) {
      throw new Error(`Quote-Job Relation with quoteId ${id} not found`);
    }

    return item;
  }

  // async remove(id: number) {
  //   return await this.quoteJobRelationsRepository.delete(id);
  // }
}
