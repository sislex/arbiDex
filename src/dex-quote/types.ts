// src/dex-quote/types.ts
export type FeeTier = 500 | 3000 | 10000;

export interface QuoteInput {
  chainId: number;
  base: string; // token address (BASE)
  quote: string; // token address (QUOTE)
  amountBase: string; // человекочитаемо, напр. "0.5"
  baseDecimals: number; // 18 для WETH, 6 для USDC — лучше пробрасывать
  quoteDecimals: number; // чтобы не парсить в провайдерах
  // опции:
  candidateFees?: FeeTier[]; // для UniV3 (по умолчанию [500,3000,10000])
}

export interface QuoteResult {
  ok: boolean;
  dex: string; // 'UniswapV3' | 'SushiV2' | ...
  side: 'SELL_BASE' | 'BUY_BASE';
  feeTier?: FeeTier | null; // null для v2
  amountBaseAtomic: bigint; // в минималках BASE
  amountQuoteAtomic: bigint; // в минималках QUOTE
  err?: string;
}

export type CreateUniOpts = {
  dex: 'UniswapV3';
  rpcUrl: string;
  chainId: number;
  quoterAddr: string;
  factoryAddr: string;
};

export type CreateSushiOpts = {
  dex: 'SushiV2';
  rpcUrl: string;
  chainId: number;
  routerAddr: string;
};
