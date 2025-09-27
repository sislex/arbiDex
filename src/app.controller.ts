import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { TokensService } from './db/services/tokens/tokens.service';
import { Tokens } from './db/entities/Tokens';
import { Dexes } from './db/entities/Dexes';
import { DexesService } from './db/services/dexes/dexes.service';
import { QuotesService } from './db/services/quotes/quotes.service';
import { Quotes } from './db/entities/Quotes';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly tokensService: TokensService,
    private readonly dexesService: DexesService,
    private readonly quotesService: QuotesService,
  ) {}

  @Get()
  start(): string {
    return this.appService.getHello();
  }

  @Get('endpoints')
  endpoints(): string {
    return this.appService.getHello();
  }

  @Get('getAllTokens')
  async getAllTokens(): Promise<Tokens[]> {
    return this.tokensService.getAll();
  }

  @Get('getAllDexes')
  async getAllDexes(): Promise<Dexes[]> {
    return this.dexesService.getAll();
  }

  @Get('getAllDexesPoolsTokens')
  async getAllDexesPoolsTokens(): Promise<Dexes[]> {
    return this.dexesService.getAllWithPoolsAndTokens();
  }

  @Get('getAllWithExistPools')
  async getAllWithExistPools(): Promise<Dexes[]> {
    return this.dexesService.getAllWithExistPools();
  }

  @Get('getLastQuotesByMarketId')
  async getLastQuotesByMarketId(): Promise<Quotes[]> {
    return await this.quotesService.getLastQuotesByMarketId('1');
  }
}
