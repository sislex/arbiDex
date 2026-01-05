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

  async createMany(pairQuoteRelationDto: PairQuoteRelationDto[]) {
    const data = await Promise.all(
      pairQuoteRelationDto.map(async (dto) => {
        const pair = await this.pairsService.findOne(dto.pairId);
        const quote = await this.quotesService.findOne(dto.quoteId);
        return { pair, quote };
      }),
    );

    return await this.pairQuoteRelationsRepository.save(data);
  }

  async findAll() {
    return await this.pairQuoteRelationsRepository.find({
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

  async remove(id: string[]) {
    return await this.pairQuoteRelationsRepository.delete(id);
  }
}
