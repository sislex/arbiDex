import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JobsService } from '../jobs/jobs.service';
import { QuoteJobRelations } from '../entities/entities/QuoteJobRelations';
import { QuoteJobRelationDto } from '../dtos/quote-job-relations-dto/quote-job-relation.dto';
import { PairQuoteRelationsService } from '../pair-quote-relations/pair-quote-relations.service';

@Injectable()
export class QuoteJobRelationsService {
  constructor(
    @InjectRepository(QuoteJobRelations)
    private quoteJobRelationsRepository: Repository<QuoteJobRelations>,
    private jobsService: JobsService,
    private pairQuoteRelationsService: PairQuoteRelationsService,
  ) {}

  async createMany(quoteJobRelationDto: QuoteJobRelationDto[]) {
    const data = await Promise.all(
      quoteJobRelationDto.map(async (dto) => {
        const job = await this.jobsService.findOne(dto.jobId);
        const quoteRelation = await this.pairQuoteRelationsService.findOne(
          dto.quoteRelationId,
        );
        return { job, quoteRelation };
      }),
    );

    return await this.quoteJobRelationsRepository.save(data);
  }

  async findByQuoteId(id: string) {
    const item = await this.quoteJobRelationsRepository.find({
      where: {
        job: {
          jobId: id,
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

  async remove(id: string[] | number[]) {
    return await this.quoteJobRelationsRepository.delete(id);
  }
}
