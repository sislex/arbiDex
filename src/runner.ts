import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DexFactoryService } from './dex-quote/dex-factory.service';
import { DexesService } from './db/services/dexes/dexes.service';
import { DexQuoteProvider } from './dex-quote/dex-quote.provider';
import { Dexes } from './db/entities/Dexes';

export class DexSwapModel {
  readonly poolId: string;
  readonly dexId: string;
  readonly dexName: string;
  readonly dexQuoteProvider: DexQuoteProvider;
  readonly feeTier: number;
  readonly baseTokenAddress: string;
  readonly quoteTokenAddress: string;
  readonly baseDecimals: number;
  readonly quoteDecimals: number;
  readonly amountInBase: string;

  constructor(config: {
    poolId: string;
    dexId: string;
    dexName: string;
    dexQuoteProvider: DexQuoteProvider;
    feeTier: number;
    baseTokenAddress: string;
    quoteTokenAddress: string;
    baseDecimals: number;
    quoteDecimals: number;
    amountInBase: string;
  }) {
    this.poolId = config.poolId;
    this.dexId = config.dexId;
    this.dexName = config.dexName;
    this.dexQuoteProvider = config.dexQuoteProvider;
    this.feeTier = config.feeTier;
    this.baseTokenAddress = config.baseTokenAddress;
    this.quoteTokenAddress = config.quoteTokenAddress;
    this.baseDecimals = config.baseDecimals;
    this.quoteDecimals = config.quoteDecimals;
    this.amountInBase = config.amountInBase;
  }

  getQuotes() {
    return Promise.all([this.getBuyQuote(), this.getSellQuote()]);
  }

  getBuyQuote() {
    return this.dexQuoteProvider.getBuyQuote({
      chainId: 42161,
      base: this.baseTokenAddress,
      quote: this.quoteTokenAddress,
      amountBase: this.amountInBase,
      baseDecimals: this.baseDecimals,
      quoteDecimals: this.quoteDecimals,
      candidateFees: [3000],
    });
  }

  getSellQuote() {
    return this.dexQuoteProvider.getSellQuote({
      chainId: 42161,
      base: this.baseTokenAddress,
      quote: this.quoteTokenAddress,
      amountBase: this.amountInBase,
      baseDecimals: this.baseDecimals,
      quoteDecimals: this.quoteDecimals,
      candidateFees: [3000],
    });
  }
}

@Injectable()
export class Runner {
  private readonly logger = new Logger(Runner.name);

  private readonly RPC_URL: string;
  private readonly AMOUNT_IN_WETH: string;

  private swapList: DexSwapModel[];

  constructor(
    private cfg: ConfigService,
    private readonly dexFactory: DexFactoryService,
    private readonly dexesService: DexesService,
  ) {
    this.RPC_URL = this.cfg.get<string>('RPC_URL') ?? '';
    this.AMOUNT_IN_WETH = this.cfg.get<string>('AMOUNT_IN_WETH') ?? '0.05';

    void this.init();
    // void this.demo();
  }

  async init() {
    this.swapList = await this.setDexSwapModelList();
    console.log(this.swapList);
    const quotes = await this.swapList[1].getQuotes();
    console.log(quotes);
  }

  async setDexSwapModelList(): Promise<DexSwapModel[]> {
    const swapList: DexSwapModel[] = [];
    const baseDecimals = 18;
    const quoteDecimals = 6;
    const dexes = await this.dexesService.getAllWithExistPools();
    console.log(dexes);
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
          dexId,
          dexName,
          dexQuoteProvider,
          feeTier: dexPool.feeTier as number,
          baseTokenAddress: dexPool.market.baseToken.address,
          quoteTokenAddress: dexPool.market.quoteToken.address,
          baseDecimals,
          quoteDecimals,
          amountInBase: this.AMOUNT_IN_WETH,
        };

        console.log(config);

        swapList.push(new DexSwapModel(config));
      });
    });
    return swapList;
  }
}
