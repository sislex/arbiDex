import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DexFactoryService } from './dex-quote/dex-factory.service';
import { DexesService } from './db/services/dexes/dexes.service';
import { DexQuoteProvider } from './dex-quote/dex-quote.provider';
import { Dexes } from './db/entities/Dexes';
import { FeeTier } from './dex-quote/types';
import { QuotesService } from './db/services/quotes/quotes.service';
import { DexSwapModel } from './models/dexSwap.model';

type QuoteResult = {
  ok: boolean;
  dex: 'SushiV2' | 'UniswapV3';
  side: 'BUY_BASE' | 'SELL_BASE';
  feeTier?: number;
  amountBaseAtomic: bigint;
  amountQuoteAtomic: bigint;
  latencyMs?: number;
  blockNumber?: number;
  error?: string | null;
};

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

@Injectable()
export class Runner {
  private readonly logger = new Logger(Runner.name);

  private readonly RPC_URL: string;
  private readonly AMOUNT_IN_WETH: string;

  private swapList: DexSwapModel[];

  private running = true;
  private readonly REQUEST_TIMEOUT_MS = 10_000; // таймаут одного опроса

  constructor(
    private cfg: ConfigService,
    private readonly dexFactory: DexFactoryService,
    private readonly dexesService: DexesService,
    private readonly quotesService: QuotesService,
  ) {
    this.RPC_URL = this.cfg.get<string>('RPC_URL') ?? '';
    this.AMOUNT_IN_WETH = this.cfg.get<string>('AMOUNT_IN_WETH') ?? '0.05';

    void this.init();
    // void this.demo();
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

        // тут можно записывать в БД/шину/очередь и т.д.

        const buyResult: QuoteResult = {
          ok: true,
          dex: buy.dex as 'SushiV2' | 'UniswapV3',
          side: buy.side,
          feeTier: buy.feeTier as FeeTier,
          amountBaseAtomic: buy.amountBaseAtomic,
          amountQuoteAtomic: buy.amountQuoteAtomic,
          blockNumber: buy.blockNumber,
          latencyMs: buy.latencyMs,
          // error?: string | null;
        };
        await this.mapAndSaveQuote(swap, buyResult, 'EXACT_OUT');

        const sellResult: QuoteResult = {
          ok: true,
          dex: sell.dex as 'SushiV2' | 'UniswapV3',
          side: sell.side,
          feeTier: sell.feeTier as FeeTier,
          amountBaseAtomic: sell.amountBaseAtomic,
          amountQuoteAtomic: sell.amountQuoteAtomic,
          blockNumber: sell.blockNumber,
          latencyMs: sell.latencyMs,
          // error?: string | null;
        };
        const quote = await this.mapAndSaveQuote(swap, sellResult, 'EXACT_IN');
        console.log(quote.id, quote.marketId);


        // сразу идём на следующий круг (без общей задержки)
        // при желании можно добавить микропаузу, чтобы не «забивать» RPC:
        await sleep(2500);
      } catch (err: any) {
        this.logger.warn(
          `[${index}] ${swap.dexName} pool=${swap.poolId} error: ${err?.message ?? err}`,
        );
      }
    }

    this.logger.log(`[${index}] ${swap.dexName} poller stopped`);
  }

  private mapAndSaveQuote(
    swap: DexSwapModel,
    res: QuoteResult,
    kind: 'EXACT_IN' | 'EXACT_OUT',
  ) {
    const config = {
      chainId: 42161,
      dexId: swap.dexId,
      marketId: swap.marketId,
      side: res.side,
      kind,
      feeTier: res.feeTier ?? null,
      amountBaseAtomic: res.amountBaseAtomic,
      amountQuoteAtomic: res.amountQuoteAtomic,
      ok: res.ok,
      errorMessage: res.ok ? null : (res.error ?? null),
      latencyMs: res.latencyMs ?? null,
      gasQuoteAtomic: null, // если посчитаешь газ — подставь сюда
      blockNumber: res.blockNumber ?? null,
    };

    return this.quotesService.save(config);
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
