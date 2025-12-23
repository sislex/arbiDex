import { Injectable } from '@nestjs/common';
import { QuoteJobRelationDto } from '../dtos/quote-job-relations-dto/quote-job-relation.dto';
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
  async create(createQuoteJobRelationDto: QuoteJobRelationDto) {
    const job = await this.jobsService.findOne(createQuoteJobRelationDto.jobId);
    const quote = await this.quotesService.findOne(
      createQuoteJobRelationDto.quoteId,
    );

    const quoteJobRelation = this.quoteJobRelationsRepository.create({
      job,
      quote,
    });

    return await this.quoteJobRelationsRepository.save(quoteJobRelation);
  }

  async findAll() {
    return await this.quoteJobRelationsRepository.find({
      relations: ['job', 'quote'],
      order: {
        quoteJobRelationId: 'DESC',
      },
    });
  }

  async findOne(id: number) {
    const item = await this.quoteJobRelationsRepository.findOne({
      where: { quoteJobRelationId: id.toString() },
      relations: ['job', 'quote'],
    });
    if (!item) {
      throw new Error(`Quote-Job Relation with id ${id} not found`);
    }
    return item;
  }

  async update(id: number, updateQuoteJobRelationDto: QuoteJobRelationDto) {
    const quoteJobRelations = await this.findOne(id);

    quoteJobRelations.job = await this.jobsService.findOne(
      updateQuoteJobRelationDto.jobId,
    );
    quoteJobRelations.quote = await this.quotesService.findOne(
      updateQuoteJobRelationDto.quoteId,
    );

    return await this.quoteJobRelationsRepository.save(quoteJobRelations);
  }

  async remove(id: number) {
    return await this.quoteJobRelationsRepository.delete(id);
  }
}
