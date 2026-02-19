import { Injectable } from '@nestjs/common';
import { QuoteDto } from '../dtos/quotes-dto/quote.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Quotes } from '../entities/entities/Quotes';
import { Repository } from 'typeorm';
import { TokensService } from '../tokens/tokens.service';

@Injectable()
export class QuotesService {
  constructor(
    @InjectRepository(Quotes)
    private quotesRepository: Repository<Quotes>,
    private tokensService: TokensService,
  ) {}
  async create(createQuoteDto: QuoteDto) {
    const token = await this.tokensService.findOne(createQuoteDto.token);

    const quote = this.quotesRepository.create({
      amount: createQuoteDto.amount,
      side: 'exactIn',
      blockTag: 'latest',
      quoteSource: createQuoteDto.quoteSource,
      token,
    });
    return await this.quotesRepository.save(quote);
  }

  async findAll() {
    return await this.quotesRepository.find({
      relations: {
        token: true,
        pairQuoteRelations: true,
      },
      select: {
        quoteId: true,
        amount: true,
        blockTag: true,
        quoteSource: true,
        side: true,
        token: {
          tokenId: true,
        },
        pairQuoteRelations: {
          pairQuoteRelationId: true,
        },
      },
      order: {
        quoteId: 'DESC',
      },
    });
  }

  async findOne(id: number) {
    const quote = await this.quotesRepository.findOne({
      where: { quoteId: id.toString() },
      relations: {
        token: true,
        pairQuoteRelations: true,
      },
      select: {
        quoteId: true,
        amount: true,
        blockTag: true,
        quoteSource: true,
        side: true,
        token: {
          tokenId: true,
        },
        pairQuoteRelations: {
          pairQuoteRelationId: true,
        },
      },
    });
    if (!quote) {
      throw new Error(`Quote with id ${id} not found`);
    }
    return quote;
  }

  async update(id: number, updateQuoteDto: QuoteDto) {
    const quote = await this.findOne(id);
    const token = await this.tokensService.findOne(updateQuoteDto.token);

    quote.amount = updateQuoteDto.amount;
    quote.side = updateQuoteDto.side;
    quote.blockTag = updateQuoteDto.blockTag;
    quote.quoteSource = updateQuoteDto.quoteSource;
    quote.token = token;

    return await this.quotesRepository.save(quote);
  }

  async remove(id: number) {
    return this.quotesRepository.delete(id);
  }
}
