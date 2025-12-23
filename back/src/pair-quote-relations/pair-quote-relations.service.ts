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

  async findOne(id: number) {
    const item = await this.pairQuoteRelationsRepository.findOne({
      where: { pairQuoteRelationId: id.toString() },
      relations: ['pair', 'quote'],
    });
    if (!item) {
      throw new Error(`Pair-Quote Relation with id ${id} not found`);
    }
    return item;
  }

  async update(id: number, pairQuoteRelationDto: PairQuoteRelationDto) {
    const pairQuoteRelations = await this.findOne(id);

    pairQuoteRelations.pair = await this.pairsService.findOne(
      pairQuoteRelationDto.pairId,
    );
    pairQuoteRelations.quote = await this.quotesService.findOne(
      pairQuoteRelationDto.quoteId,
    );

    return await this.pairQuoteRelationsRepository.save(pairQuoteRelations);
  }

  async remove(id: number) {
    return await this.pairQuoteRelationsRepository.delete(id);
  }
}
