import { DexQuoteProvider } from '../dex-quote/dex-quote.provider';
import { FeeTier } from '../dex-quote/types';

export class DexSwapModel {
  readonly poolId: string;
  readonly marketId: string;
  readonly dexId: string;
  readonly dexName: string;
  readonly dexQuoteProvider: DexQuoteProvider;
  readonly feeTier: FeeTier;
  readonly baseTokenAddress: string;
  readonly quoteTokenAddress: string;
  readonly baseDecimals: number;
  readonly quoteDecimals: number;
  readonly amountInBase: string;

  constructor(config: {
    poolId: string;
    marketId: string;
    dexId: string;
    dexName: string;
    dexQuoteProvider: DexQuoteProvider;
    feeTier: FeeTier;
    baseTokenAddress: string;
    quoteTokenAddress: string;
    baseDecimals: number;
    quoteDecimals: number;
    amountInBase: string;
  }) {
    this.poolId = config.poolId;
    this.marketId = config.marketId;
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
      candidateFees: [this.feeTier],
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
      candidateFees: [this.feeTier],
    });
  }
}
