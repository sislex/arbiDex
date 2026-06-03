export interface Token {
  tokenId: number;
  tokenName: string;
  symbol: string;
  address: string;
  decimals: number;
  chainId: number;
  isActive: boolean;
}

export interface Chain {
  chainId: number;
  name: string;
}

export interface Dex {
  dexId: number;
  name: string;
}

export interface Pool {
  poolId: number;
  chainId: number;
  dexId: number;
  token0Id: number;
  token1Id: number;
  poolAddress: string;
  fee: number;
  version: "v2" | "v3" | "v4";
}

export interface Job {
  jobId: number;
  chainId: number;
  rpcUrlId: number;
  jobType: string;
}

export interface CexChain {
  id: number;
  name: string;
}

export interface CexPair {
  id: number;
  source: number;
  token0: string;
  token1: string;
}

export interface CexJob {
  id: number;
  cex_pair_id: number;
  job_type: string;
}

export interface Bot {
  botId: number;
  botName: string;
  jobId: number | null;
  cexJobId: number | null;
  serverId: number;
}

export interface Server {
  serverId: number;
  serverName: string;
  ip: string;
  port: number;
}

export interface RpcUrl {
  rpcUrlId: number;
  chainId: number;
  rpcUrl: string;
}

export interface SwapRate {
  swapRate0: number;
  swapRate1: number;
  swapRateCount: number;
}

export const mockTokens: Token[] = [
  {
    tokenId: 1,
    tokenName: "Ethereum",
    symbol: "ETH",
    address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    decimals: 18,
    chainId: 1,
    isActive: true,
  },
  {
    tokenId: 2,
    tokenName: "Tether USD",
    symbol: "USDT",
    address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    decimals: 6,
    chainId: 1,
    isActive: true,
  },
  {
    tokenId: 3,
    tokenName: "Wrapped BTC",
    symbol: "WBTC",
    address: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
    decimals: 8,
    chainId: 1,
    isActive: true,
  },
  {
    tokenId: 4,
    tokenName: "USD Coin",
    symbol: "USDC",
    address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    decimals: 6,
    chainId: 1,
    isActive: true,
  },
  {
    tokenId: 5,
    tokenName: "Binance Coin",
    symbol: "BNB",
    address: "0xB8c77482e45F1F44dE1745F52C74426C631bDD52",
    decimals: 18,
    chainId: 56,
    isActive: true,
  },
];

export const mockChains: Chain[] = [
  { chainId: 1, name: "Ethereum" },
  { chainId: 56, name: "BSC" },
  { chainId: 42161, name: "Arbitrum" },
];

export const mockDexes: Dex[] = [
  { dexId: 1, name: "Uniswap" },
  { dexId: 2, name: "PancakeSwap" },
  { dexId: 3, name: "Camelot" },
];

export const mockPools: Pool[] = [
  {
    poolId: 1,
    chainId: 1,
    dexId: 1,
    token0Id: 1,
    token1Id: 2,
    poolAddress: "0x1d42064Fc4Beb5F8aAF85F4617AE8b3b5B8Bd801",
    fee: 3000,
    version: "v3",
  },
  {
    poolId: 2,
    chainId: 1,
    dexId: 1,
    token0Id: 3,
    token1Id: 1,
    poolAddress: "0xCBCdF9626bc03E24f779434178A73a0B4Bad62eD",
    fee: 3000,
    version: "v3",
  },
  {
    poolId: 3,
    chainId: 56,
    dexId: 2,
    token0Id: 5,
    token1Id: 2,
    poolAddress: "0x58F876857a02D6762E0101bb5C46A8c1ED44Dc16",
    fee: 2500,
    version: "v2",
  },
];

export const mockJobs: Job[] = [
  { jobId: 1, chainId: 1, rpcUrlId: 1, jobType: "dex:ethereum" },
  { jobId: 2, chainId: 56, rpcUrlId: 2, jobType: "dex:bsc" },
];

export const mockCexChains: CexChain[] = [
  { id: 1, name: "Binance" },
  { id: 2, name: "Bybit" },
];

export const mockCexPairs: CexPair[] = [
  { id: 1, source: 1, token0: "BTC", token1: "USDT" },
  { id: 2, source: 2, token0: "ETH", token1: "USDT" },
];

export const mockCexJobs: CexJob[] = [
  { id: 1, cex_pair_id: 1, job_type: "cex:binance" },
  { id: 2, cex_pair_id: 2, job_type: "cex:bybit" },
];

export const mockServers: Server[] = [
  { serverId: 1, serverName: "Server EU", ip: "127.0.0.1", port: 3001 },
  { serverId: 2, serverName: "Server US", ip: "127.0.0.1", port: 3002 },
];

export const mockBots: Bot[] = [
  { botId: 1, botName: "ArbiBot ETH", jobId: 1, cexJobId: null, serverId: 1 },
  { botId: 2, botName: "ArbiBot CEX", jobId: null, cexJobId: 1, serverId: 2 },
];

export const mockRpcUrls: RpcUrl[] = [
  { rpcUrlId: 1, chainId: 1, rpcUrl: "https://eth.llamarpc.com" },
  { rpcUrlId: 2, chainId: 56, rpcUrl: "https://bsc-dataseed.binance.org" },
];

export const mockSwapRate: SwapRate[] = [
  { swapRate0: 1, swapRate1: 2, swapRateCount: 3600 },
  { swapRate0: 1, swapRate1: 4, swapRateCount: 3620 },
  { swapRate0: 3, swapRate1: 1, swapRateCount: 15.2 },
];

