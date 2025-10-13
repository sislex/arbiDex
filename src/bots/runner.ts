import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DexFactoryService } from '../dex-quote/dex-factory.service';
import { DexesService } from '../db/services/dexes/dexes.service';
import { DexQuoteProvider } from '../dex-quote/dex-quote.provider';
import { Dexes } from '../db/entities/Dexes';
import { FeeTier, QuoteResult } from '../dex-quote/types';
import {
  QuotesService,
  SaveQuoteInput,
} from '../db/services/quotes/quotes.service';
import { DexSwapModel } from '../models/dexSwap.model';
import { ArbEvalsService } from '../db/services/arbEvals/arb-evals.service';
import { Quotes } from '../db/entities/Quotes';

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

@Injectable()
export class Runner {
  private readonly logger = new Logger(Runner.name);

  private readonly RPC_URL: string;

  private swapList: DexSwapModel[];

  private running = true;
  private readonly REQUEST_TIMEOUT_MS = 10_000; // таймаут одного опроса

  constructor(
    private cfg: ConfigService,
    private readonly dexFactory: DexFactoryService,
    private readonly dexesService: DexesService,
    private readonly quotesService: QuotesService,
    private readonly arbEvalsService: ArbEvalsService,
  ) {
    this.RPC_URL = this.cfg.get<string>('RPC_URL') ?? '';

    void this.init();
  }

  async init() {
    this.swapList = await this.setDexSwapModelList();
    console.log(this.swapList);

    // Запускаем независимый цикл на каждый swap
    for (let i = 0; i < this.swapList.length; i++) {
      const swap = this.swapList[i];
      void this.spawnPoller(swap, i);
    }
  }

  private async spawnPoller(swap: DexSwapModel, index: number) {
    const withTimeout = <T>(p: Promise<T>, ms: number) =>
      Promise.race<T>([
        p,
        new Promise<T>((_, rej) =>
          setTimeout(() => rej(new Error('REQUEST_TIMEOUT')), ms),
        ),
      ]);

    while (this.running) {
      try {
        // основной опрос (два котирования внутри уже параллелятся в getQuotes)
        const [buy, sell] = await withTimeout(
          swap.getQuotes(),
          this.REQUEST_TIMEOUT_MS,
        );

        // this.logger.warn(buy);
        // this.logger.log(sell);


        const quoteList: Quotes[] = await this.mapAndSaveQuote(swap, [buy, sell]);


        const quotes: Quotes[] =
          await this.quotesService.getLastQuotesByMarketIdAndQuoteId(
            quoteList[1].marketId,
            quoteList[1].id,
          );
        console.log('--+++--', quoteList[1].marketId, quoteList[1].id);

        const arbEvals = this.arbEvalsService.getArbEvalFromQuotes(quotes);
        const savedEval = await this.arbEvalsService.saveEvaluation(arbEvals);
        // console.log('Saved arb eval:', savedEval.id, savedEval.spreadPct);

        // пауза между циклами (чтобы не спамить слишком часто)
        await sleep(500);
      } catch (err: any) {
        this.logger.warn(
          `[${index}] ${swap.dexName} pool=${swap.poolId} error: ${err?.message ?? err}`,
        );
      }
    }

    this.logger.log(`[${index}] ${swap.dexName} poller stopped`);
  }

  private mapAndSaveQuote(swap: DexSwapModel, responseList: QuoteResult[]) {
    const arbEvals: SaveQuoteInput[] = [];
    responseList.forEach((response: QuoteResult) => {
      const arbEval = {
        chainId: 42161,
        dexId: swap.dexId,
        marketId: swap.marketId,
        side: response.side,
        kind: response.kind,
        feeTier: response.feeTier ?? null,
        amountBaseAtomic: response.amountBaseAtomic,
        amountQuoteAtomic: response.amountQuoteAtomic,
        ok: response.ok,
        errorMessage: response.ok ? null : (response.error ?? null),
        latencyMs: response.latencyMs ?? null,
        gasQuoteAtomic: null, // если посчитаешь газ — подставь сюда
        blockNumber: response.blockNumber ?? null,
      };
      arbEvals.push(arbEval);
    });

    return this.quotesService.saveList(arbEvals);
  }

  async setDexSwapModelList(): Promise<DexSwapModel[]> {
    const swapList: DexSwapModel[] = [];
    const baseDecimals = 18;
    const quoteDecimals = 6;
    const dexes = await this.dexesService.getAllWithExistPools();
    dexes.forEach((dex: Dexes) => {
      const dexId = dex.dexId;
      const dexName = dex.name;
      let dexQuoteProvider: DexQuoteProvider;
      if (dex.name === 'UniswapV3') {
        dexQuoteProvider = this.dexFactory.create({
          dex: dex.name,
          rpcUrl: this.RPC_URL,
          chainId: 42161,
          quoterAddr: dex.quoterAddr as string,
          factoryAddr: dex.factoryAddr as string,
        });
      } else if (dex.name === 'SushiV2') {
        dexQuoteProvider = this.dexFactory.create({
          dex: dex.name,
          rpcUrl: this.RPC_URL,
          chainId: 42161,
          routerAddr: dex.routerAddr as string,
        });
      }

      dex.dexPools.forEach((dexPool) => {
        const config = {
          poolId: dexPool.poolId,
          marketId: dexPool.marketId,
          dexId,
          dexName,
          dexQuoteProvider,
          feeTier: dexPool.feeTier as FeeTier,
          baseTokenAddress: dexPool.market.baseToken.address,
          quoteTokenAddress: dexPool.market.quoteToken.address,
          baseDecimals,
          quoteDecimals,
          amountInBase: dexPool.amountBase as string,
        };

        swapList.push(new DexSwapModel(config));
      });
    });
    return swapList;
  }
}
