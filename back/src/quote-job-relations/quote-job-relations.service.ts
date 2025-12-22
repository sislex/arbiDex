import { Injectable } from '@nestjs/common';
import { QuoteJobRelationDto } from '../dtos/quote-job-relations-dto/quote-job-relation.dto';

@Injectable()
export class QuoteJobRelationsService {
  create(createQuoteJobRelationDto: QuoteJobRelationDto) {
    return 'This action adds a new quoteJobRelation';
  }

  findAll() {
    return `This action returns all quoteJobRelations`;
  }

  findOne(id: number) {
    return `This action returns a #${id} quoteJobRelation`;
  }

  update(id: number, updateQuoteJobRelationDto: QuoteJobRelationDto) {
    return `This action updates a #${id} quoteJobRelation`;
  }

  remove(id: number) {
    return `This action removes a #${id} quoteJobRelation`;
  }
}
