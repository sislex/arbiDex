// src/discovery/discovery.controller.ts
import { Controller, Get, Param, Render } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Quotes } from '../../db/entities/Quotes';
import { QuotesService } from '../../db/services/quotes/quotes.service';
import { ArbEvalsService } from '../../db/services/arbEvals/arb-evals.service';

@ApiTags('quotes')
@Controller('api/quotes')
export class QuotesController {
  constructor(
    private readonly quotesService: QuotesService,
    private readonly arbEvalsService: ArbEvalsService,
  ) {}

  @Get('getLastQuotesByMarketIdAndQuoteId/:marketId')
  async getLastQuotesByMarketIdAndQuoteIdLast(
    @Param('marketId') marketId: string,
    @Param('quoteId') quoteId?: string,
  ): Promise<Quotes[]> {
    return await this.quotesService.getLastQuotesByMarketIdAndQuoteId(
      marketId,
      quoteId,
    );
  }

  @Get('getLastQuotesByMarketIdAndQuoteId/:marketId/:quoteId')
  async getLastQuotesByMarketIdAndQuoteId(
    @Param('marketId') marketId: string,
    @Param('quoteId') quoteId?: string,
  ): Promise<Quotes[]> {
    return await this.quotesService.getLastQuotesByMarketIdAndQuoteId(
      marketId,
      quoteId,
    );
  }

  @Get('html/getLastQuotesByMarketIdAndQuoteId/:marketId')
  @Render('quotes')
  async getLastQuotesByMarketIdAndQuoteIdLastHtml(
    @Param('marketId') marketId: string,
    @Param('quoteId') quoteId?: string,
  ) {
    return this.getQuotesHtml(marketId, quoteId);
  }

  @Get('html/getLastQuotesByMarketIdAndQuoteId/:marketId/:quoteId')
  @Render('quotes')
  async getLastQuotesByMarketIdAndQuoteIdHtml(
    @Param('marketId') marketId: string,
    @Param('quoteId') quoteId?: string,
  ) {
    return this.getQuotesHtml(marketId, quoteId);
  }

  @Render('quotes')
  async getQuotesHtml(marketId: string, quoteId?: string) {
    let quotes: Quotes[];
    if (quoteId) {
      quotes = await this.quotesService.getLastQuotesByMarketIdAndQuoteId(
        marketId,
        quoteId,
      );
    } else {
      quotes = await this.quotesService.getLastQuotesByMarketId(marketId);
    }

    const arbEvals = this.arbEvalsService.getArbEvalFromQuotes(quotes);

    return {
      title: `Last Quotes (Market ${marketId}) from Quote ID ${quoteId}`,
      marketId,
      chainId: quotes[0]?.chainId ?? '',
      quotes: quotes,
      arbEvals,
    };
  }
}
