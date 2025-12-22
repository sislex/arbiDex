import { Injectable } from '@nestjs/common';
import { QuoteDto } from '../dtos/quotes-dto/quote.dto';

@Injectable()
export class QuotesService {
  create(createQuoteDto: QuoteDto) {
    return 'This action adds a new quote';
  }

  findAll() {
    return `This action returns all quotes`;
  }

  findOne(id: number) {
    return `This action returns a #${id} quote`;
  }

  update(id: number, updateQuoteDto: QuoteDto) {
    return `This action updates a #${id} quote`;
  }

  remove(id: number) {
    return `This action removes a #${id} quote`;
  }
}
