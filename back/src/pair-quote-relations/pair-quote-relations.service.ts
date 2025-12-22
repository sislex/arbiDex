import { Injectable } from '@nestjs/common';
import { PairQuoteRelationDto } from '../dtos/pair-quote-relations-dto/pair-quote-relation.dto';

@Injectable()
export class PairQuoteRelationsService {
  create(createPairQuoteRelationDto: PairQuoteRelationDto) {
    return 'This action adds a new pairQuoteRelation';
  }

  findAll() {
    return `This action returns all pairQuoteRelations`;
  }

  findOne(id: number) {
    return `This action returns a #${id} pairQuoteRelation`;
  }

  update(id: number, updatePairQuoteRelationDto: PairQuoteRelationDto) {
    return `This action updates a #${id} pairQuoteRelation`;
  }

  remove(id: number) {
    return `This action removes a #${id} pairQuoteRelation`;
  }
}
