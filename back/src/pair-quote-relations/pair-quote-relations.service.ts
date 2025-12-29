import { Injectable } from '@nestjs/common';
import { PairQuoteRelationDto } from '../dtos/pair-quote-relations-dto/pair-quote-relation.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PairQuoteRelations } from '../entities/entities/PairQuoteRelations';
import { Repository } from 'typeorm';
import { PairsService } from '../pairs/pairs.service';
import { QuotesService } from '../quotes/quotes.service';

@Injectable()
export class PairQuoteRelationsService {
  constructor(
    @InjectRepository(PairQuoteRelations)
    private pairQuoteRelationsRepository: Repository<PairQuoteRelations>,
    private pairsService: PairsService,
    private quotesService: QuotesService,
  ) {}
  async create(pairQuoteRelationDto: PairQuoteRelationDto) {
    const pair = await this.pairsService.findOne(pairQuoteRelationDto.pairId);
    const quote = await this.quotesService.findOne(
      pairQuoteRelationDto.quoteId,
    );

    const pairQuoteRelation = this.pairQuoteRelationsRepository.create({
      pair,
      quote,
    });

    return await this.pairQuoteRelationsRepository.save(pairQuoteRelation);
  }

  async findAll() {
    return await this.pairQuoteRelationsRepository.find({
      relations: ['pair', 'quote'],
      order: {
        pairQuoteRelationId: 'DESC',
      },
    });
  }

  async findOne(id: string) {
    const item = await this.pairQuoteRelationsRepository.findOne({
      where: { pairQuoteRelationId: id },
      relations: [
        'pair',
        'pair.tokenIn',
        'pair.tokenOut',
        'pair.pool',
        'pair.pool.dex',
        'pair.pool.chain',
        'pair.pool.token',
        'pair.pool.token2',
        'quote',
      ],
    });
    if (!item) {
      throw new Error(`Pair-Quote Relation with id ${id} not found`);
    }
    return item;
  }

  async findByQuoteId(id: string) {
    const item = await this.pairQuoteRelationsRepository.find({
      where: {
        quote: {
          quoteId: id,
        },
      },
      relations: [
        'pair',
        'pair.tokenIn',
        'pair.tokenOut',
        'pair.pool',
        'pair.pool.dex',
        'pair.pool.chain',
        'pair.pool.token',
        'pair.pool.token2',
        'quote',
      ],
    });
    if (!item) {
      throw new Error(`Pair-Quote Relation with id ${id} not found`);
    }
    return item;
  }

  async remove(id: string) {
    return await this.pairQuoteRelationsRepository.delete(id);
  }
}
