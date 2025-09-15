import { QuoteInput, QuoteResult } from './types';

export interface DexQuoteProvider {
  readonly name: string; // 'UniswapV3' / 'SushiV2' / ...
  getSellQuote(input: QuoteInput): Promise<QuoteResult>; // exact-in
  getBuyQuote(input: QuoteInput): Promise<QuoteResult>; // exact-out
}
