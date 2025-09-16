import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DexFactoryService } from './dex-quote/dex-factory.service';

@Injectable()
export class Runner {
  private readonly logger = new Logger(Runner.name);

  private readonly amountInWETH: string;

  constructor(
    private cfg: ConfigService,
    private readonly dexFactory: DexFactoryService,
  ) {
    this.amountInWETH = this.cfg.get<string>('AMOUNT_IN_WETH') ?? '0.05';

    void this.demo();
  }

  async demo() {
    const uni = this.dexFactory.create({
      dex: 'UniswapV3',
      rpcUrl: 'https://arb1.arbitrum.io/rpc',
      chainId: 42161,
      quoterAddr: '0x61fFE014bA17989E743c5F6cB21bF9697530B21e',
      factoryAddr: '0x1F98431c8aD98523631AE4a59f267346ea31F984',
    });

    const sushi = this.dexFactory.create({
      dex: 'SushiV2',
      rpcUrl: 'https://arb1.arbitrum.io/rpc',
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
      amountBase: this.amountInWETH,
      baseDecimals,
      quoteDecimals,
      candidateFees: [3000],
    });

    const sellOnUni = await uni.getSellQuote({
      chainId: 42161,
      base,
      quote,
      amountBase: this.amountInWETH,
      baseDecimals,
      quoteDecimals,
      candidateFees: [3000],
    });

    const buyOnSushi = await sushi.getBuyQuote({
      chainId: 42161,
      base,
      quote,
      amountBase: this.amountInWETH,
      baseDecimals,
      quoteDecimals,
    });

    const sellOnSushi = await sushi.getSellQuote({
      chainId: 42161,
      base,
      quote,
      amountBase: this.amountInWETH,
      baseDecimals,
      quoteDecimals,
    });

    console.log({ buyOnUni, sellOnUni, buyOnSushi, sellOnSushi });
  }
}
