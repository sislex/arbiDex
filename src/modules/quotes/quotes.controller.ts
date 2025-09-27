// src/discovery/discovery.controller.ts
import { Controller, Get, Header, Param, Render } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Quotes } from '../../db/entities/Quotes';
import { QuotesService } from '../../db/services/quotes/quotes.service';

@ApiTags('quotes')
@Controller('api/quotes')
export class QuotesController {
  constructor(private readonly quotesService: QuotesService) {}

  @Get('getLastQuotesByMarketId/:id')
  async getLastQuotesByMarketId(@Param('id') id: string): Promise<Quotes[]> {
    return await this.quotesService.getLastQuotesByMarketId(id);
  }

  @Get('html/getLastQuotesByMarketId/:marketId')
  @Render('quotes') // <-- имя шаблона без расширения
  async getLastQuotesByMarketIdHtml(@Param('marketId') marketId: string) {
    const quotes: Quotes[] =
      await this.quotesService.getLastQuotesByMarketId(marketId);

    // Можно предрассчитать некоторые поля, чтобы в шаблоне было проще
    const rows = quotes.map((q) => ({
      id: q.id,
      ts: q.ts,
      chainId: q.chainId,
      dexId: q.dexId,
      marketId: q.marketId,
      side: q.side,
      kind: q.kind,
      feeTier: q.feeTier,
      amountBase: q.amountBase, // форматируем хелпером formatBase18 в hbs
      amountQuote: q.amountQuote, // можно оставить как есть
      latencyMs: q.latencyMs,
      blockNumber: q.blockNumber,
    }));

    return {
      title: `Quotes (Market ${marketId})`,
      marketId,
      chainId: rows[0]?.chainId ?? '',
      rows,
    };
  }

  @Get('getLastQuotesByMarketIdAndQuoteId/:marketId/:quoteId')
  async getLastQuotesByMarketIdAndQuoteId(
    @Param('marketId') marketId: string,
    @Param('quoteId') quoteId: string,
  ): Promise<Quotes[]> {
    return await this.quotesService.getLastQuotesByMarketIdAndQuoteId(
      marketId,
      quoteId,
    );
  }

  @Get('html/getLastQuotesByMarketIdAndQuoteId/:marketId/:quoteId')
  @Render('quotes') // <-- имя шаблона без расширения
  async getQuotesHtml(
    @Param('marketId') marketId: string,
    @Param('quoteId') quoteId: string,
  ) {
    const quotes: Quotes[] =
      await this.quotesService.getLastQuotesByMarketIdAndQuoteId(
        marketId,
        quoteId,
      );

    // Можно предрассчитать некоторые поля, чтобы в шаблоне было проще
    const rows = quotes.map((q) => ({
      id: q.id,
      ts: q.ts,
      chainId: q.chainId,
      dexId: q.dexId,
      marketId: q.marketId,
      side: q.side,
      kind: q.kind,
      feeTier: q.feeTier,
      amountBase: q.amountBase, // форматируем хелпером formatBase18 в hbs
      amountQuote: q.amountQuote, // можно оставить как есть
      latencyMs: q.latencyMs,
      blockNumber: q.blockNumber,
    }));

    return {
      title: `Quotes (Market ${marketId})`,
      marketId,
      chainId: rows[0]?.chainId ?? '',
      rows,
    };
  }
}
