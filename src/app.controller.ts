import { Controller, Get, Header, Param } from '@nestjs/common';
import { TokensService } from './db/services/tokens/tokens.service';
import { Tokens } from './db/entities/Tokens';
import { Dexes } from './db/entities/Dexes';
import { DexesService } from './db/services/dexes/dexes.service';
import { QuotesService } from './db/services/quotes/quotes.service';
import { Quotes } from './db/entities/Quotes';

@Controller('api')
export class AppController {
  constructor(
    private readonly tokensService: TokensService,
    private readonly dexesService: DexesService,
    private readonly quotesService: QuotesService,
  ) {}

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
}
