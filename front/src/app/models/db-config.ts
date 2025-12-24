import {API} from './api';

export interface ITokensAPI extends API {
  response: ITokens[];
}
export interface ITokens {
  tokenId: number | null;
  chainId: number | null;
  address: string;
  symbol: string;
  tokenName: string;
  decimals: number | null;
}
export interface ITokensCreate {
  tokenId: number;
  chainId: number;
  address: string;
  symbol: string;
  tokenName: string;
  decimals: number;
}

export interface IPoolsAPI extends API {
  response: IPools[];
}
export interface IPools {
  poolId: number;
  chain: IChains;
  poolAddress: number;
  token: ITokens;
  token2: ITokens;
  fee: number;
  dex: IDexes;
  version: string;
}
export interface IPoolsCreate {
  poolId: number;
  chain: IChains;
  poolAddress: number;
  token: ITokens;
  token2: ITokens;
  fee: number;
  dex: IDexes;
  version: string;
}

export interface IDexesAPI extends API {
  response: IDexes[];
}
export interface IDexes {
  dexId: number;
  name: string;
}
export interface IDexesCreate {
  dexId: number;
  name: string;
}

export interface IChainsAPI extends API {
  response: IChains[];
}
export interface IChains {
  chainId: number;
  name: string;
}
export interface IChainsCreate {
  chainId: number;
  name: string;
}

export interface ISelectMenu {
  id: number;
  name: string;
}

export interface IPairsAPI extends API {
  response: IPairs[];
}
export interface IPairs {
  pairId: number;
  pool: IPools;
  tokenIn: number;
  tokenOut: number;
}
export interface IPairsCreate {
  pairId: number;
  pool: IPools;
  tokenIn: number;
  tokenOut: number;
}

export interface IQuotesAPI extends API {
  response: IQuotes[];
}
export interface IQuotes {
  quoteId: number;
  amount: number;
  side: string;
  blockTag: string;
  quoteSource: string;
}
export interface IQuotesCreate {
  quoteId: number;
  amount: number;
  side: string;
  blockTag: string;
  quoteSource: string;
}

export interface IJobsAPI extends API {
  response: IJobs[];
}
export interface IJobs {
  jobId: number;
  jobType: string;
}
export interface IJobsCreate {
  jobId: number;
  jobType: string;
}

export interface IBotsAPI extends API {
  response: IBots[];
}
export interface IBots {
  botId: number;
  botName: string;
  description: string;
  server: IServers;
}
export interface IBotsCreate {
  botId: number;
  botName: string;
  description: string;
  server: IServers;
}

export interface IServersAPI extends API {
  response: IServers[];
}
export interface IServers {
  serverId: number;
  ip: string;
  port: string;
  serverName: string;
}
export interface IServersCreate {
  serverId: number;
  ip: string;
  port: string;
  serverName: string;
}
