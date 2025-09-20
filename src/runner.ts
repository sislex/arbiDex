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
  readonly baseTokenAddress: string;
  readonly quoteTokenAddress: string;
  readonly baseDecimals: number;
  readonly quoteDecimals: number;
  readonly amountInWeth: string;

  constructor(config: {
    poolId: string;
    dexId: string;
    dexName: string;
    dexQuoteProvider: DexQuoteProvider;
    baseTokenAddress: string;
    quoteTokenAddress: string;
    baseDecimals: number;
    quoteDecimals: number;
    amountInWeth: string;
  }) {
    this.poolId = config.poolId;
    this.dexId = config.dexId;
    this.dexName = config.dexName;
    this.dexQuoteProvider = config.dexQuoteProvider;
    this.baseTokenAddress = config.baseTokenAddress;
    this.quoteTokenAddress = config.quoteTokenAddress;
    this.baseDecimals = config.baseDecimals;
    this.quoteDecimals = config.quoteDecimals;
    this.amountInWeth = config.amountInWeth;
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

    void this.setDexSwapModelList();
  }

  async setDexSwapModelList() {
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
        console.log('SushiV2 not implemented yet');
      }

      dex.dexPools.forEach((dexPool) => {
        const config = {
          poolId: dexPool.poolId,
          dexId,
          dexName,
          dexQuoteProvider,
          baseTokenAddress: dexPool.market.baseToken.address,
          quoteTokenAddress: dexPool.market.quoteToken.address,
          baseDecimals,
          quoteDecimals,
          amountInWeth: this.AMOUNT_IN_WETH,
        };

        console.log(config);

        swapList.push(new DexSwapModel(config));
      });
    });
    this.swapList = swapList;
    console.log(swapList);
  }

  async demo() {
    const uni = this.dexFactory.create({
      dex: 'UniswapV3',
      rpcUrl: this.RPC_URL,
      chainId: 42161,
      quoterAddr: '0x61fFE014bA17989E743c5F6cB21bF9697530B21e',
      factoryAddr: '0x1F98431c8aD98523631AE4a59f267346ea31F984',
    });

    const sushi = this.dexFactory.create({
      dex: 'SushiV2',
      rpcUrl: this.RPC_URL,
      chainId: 42161,
      routerAddr: '0x1b02da8cb0d097eb8d57a175b88c7d8b47997506',
    });

    const base = '0x82af49447d8a07e3bd95bd0d56f35241523fbab1'; // WETH
    const quote = '0xaf88d065e77c8cC2239327C5EDb3A432268e5831'; // USDC
    const baseDecimals = 18;
    const quoteDecimals = 6;

    const buyOnUni = await uni.getBuyQuote({
      chainId: 42161,
      base,
      quote,
      amountBase: this.AMOUNT_IN_WETH,
      baseDecimals,
      quoteDecimals,
      candidateFees: [3000],
    });

    const sellOnUni = await uni.getSellQuote({
      chainId: 42161,
      base,
      quote,
      amountBase: this.AMOUNT_IN_WETH,
      baseDecimals,
      quoteDecimals,
      candidateFees: [3000],
    });

    const buyOnSushi = await sushi.getBuyQuote({
      chainId: 42161,
      base,
      quote,
      amountBase: this.AMOUNT_IN_WETH,
      baseDecimals,
      quoteDecimals,
    });

    const sellOnSushi = await sushi.getSellQuote({
      chainId: 42161,
      base,
      quote,
      amountBase: this.AMOUNT_IN_WETH,
      baseDecimals,
      quoteDecimals,
    });

    console.log({ buyOnUni, sellOnUni, buyOnSushi, sellOnSushi });
  }
}
