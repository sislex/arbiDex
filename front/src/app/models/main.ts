export interface IArbitrumMultiQuoteJob {
  jobType: string;
  rpcUrl: string;
  pairsToQuote: IQuotePair[];
}

export interface IQuotePair {
  dex: string;
  version: "v2" |"v3" |"v4";
  token0: ITokenInfo;
  token1: ITokenInfo;
  poolAddress: string;
  feePpm: number;
  tokenIn: ITokenInfo;
  tokenOut: ITokenInfo;
  side: string;
  amount: string;
  blockTag: string;
  quoteSource: string;
  createdAt: string;
}

export interface ITokenInfo {
  address: string;
  decimals: number;
}
