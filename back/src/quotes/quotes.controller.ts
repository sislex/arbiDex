import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { QuotesService } from './quotes.service';
import { QuoteDto } from '../dtos/quotes-dto/quote.dto';

@Controller('quotes')
export class QuotesController {
  constructor(private readonly quotesService: QuotesService) {}

  @Post()
  create(@Body() createQuoteDto: QuoteDto) {
    return this.quotesService.create(createQuoteDto);
  }

  @Get()
  async findAll() {
    const quotes = await this.quotesService.findAll();

    return quotes.map(q => ({
      quoteId: q.quoteId,
      amount: q.amount,
      blockTag: q.blockTag,
      quoteSource: q.quoteSource,
      side: q.side,
      tokenId: q.token?.tokenId,
      pairsCount: q.pairQuoteRelations?.length || 0,
    }));
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const quote = await this.quotesService.findOne(+id);

    return {
      quoteId: quote.quoteId,
      amount: quote.amount,
      blockTag: quote.blockTag,
      quoteSource: quote.quoteSource,
      side: quote.side,
      tokenId: quote.token?.tokenId,
      pairsCount: quote.pairQuoteRelations?.length || 0,
    };
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateQuoteDto: QuoteDto) {
    return this.quotesService.update(+id, updateQuoteDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.quotesService.remove(+id);
  }
}
