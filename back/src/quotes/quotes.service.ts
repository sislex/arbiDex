import { Injectable } from '@nestjs/common';
import { QuoteDto } from '../dtos/quotes-dto/quote.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Quotes } from '../entities/entities/Quotes';
import { Repository } from 'typeorm';

@Injectable()
export class QuotesService {
  constructor(
    @InjectRepository(Quotes)
    private quotesRepository: Repository<Quotes>,
  ) {}
  async create(createQuoteDto: QuoteDto) {
    const quote = this.quotesRepository.create({
      amount: createQuoteDto.amount,
      side: 'exactIn',
      blockTag: 'latest',
      quoteSource: createQuoteDto.quoteSource,
    });
    return await this.quotesRepository.save(quote);
  }

  async findAll() {
    return await this.quotesRepository.find({
      order: {
        quoteId: 'DESC',
      },
    });
  }

  async findOne(id: number) {
    const quote = await this.quotesRepository.findOne({
      where: { quoteId: id.toString() },
    });
    if (!quote) {
      throw new Error(`Quote with id ${id} not found`);
    }
    return quote;
  }

  async update(id: number, updateQuoteDto: QuoteDto) {
    const quote = await this.findOne(id);

    quote.amount = updateQuoteDto.amount;
    quote.side = updateQuoteDto.side;
    quote.blockTag = updateQuoteDto.blockTag;
    quote.quoteSource = updateQuoteDto.quoteSource;

    return await this.quotesRepository.save(quote);
  }

  async remove(id: number) {
    return this.quotesRepository.delete(id);
  }
}
