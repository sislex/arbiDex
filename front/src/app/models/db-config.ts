import {API} from './api';

export interface ITokensAPI extends API {
  response: ITokens[];
}
export interface ITokens {
  tokenId: number | null;
  chain: IChains;
  address: string;
  symbol: string;
  tokenName: string;
  decimals: number | null;
  isActive: boolean | null;
  isChecked: boolean | null;
  balance: boolean | null;
}
export interface ITokensCreate {
  tokenId: number;
  chainId: number;
  address: string;
  symbol: string;
  tokenName: string;
  decimals: number;
  isActive: boolean | null;
  isChecked: boolean | null;
  balance: boolean | null;
}

export interface IPoolsAPI extends API {
  response: IPools[];
}
export interface IPools {
  poolId: number;
  chain: IChains;
  poolAddress: string;
  token: ITokens;
  token2: ITokens;
  fee: number;
  dex: IDexes;
  version: 'v2' | 'v3' | 'v4';
}
export interface IPoolsCreate {
  poolId: number;
  chainId: number;
  poolAddress: string;
  token: number;
  token2: number;
  fee: number;
  dexId: number;
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
  address?: string;
}

export interface IPairsAPI extends API {
  response: IPairs[];
}
export interface IPairs {
  pairId: number;
  pool: IPools;
  tokenIn: ITokens;
  tokenOut: ITokens;
}
export interface IPairsCreate {
  pairId: number;
  poolId: number;
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
  token: ITokens;
  pairQuoteRelations?: IPairQuoteRelation;
}
export interface IQuotesCreate {
  quoteId: number;
  amount: number;
  side: string;
  blockTag: string;
  quoteSource: string;
  token: number;
  pairQuoteRelations?: IPairQuoteRelation;
}
export interface IPairQuoteRelation {
  pairQuoteRelationId: number;
  pair?: IPairs;
  quote?: IQuotes;
}

export interface IJobsAPI extends API {
  response: IJobs[];
}
export interface IJobs {
  jobId: number;
  jobType: string;
  chainId: string;
  rpcUrl: IRpcUrl;
  pairs: number;
}
export interface IJobsCreate {
  jobId: number;
  jobType: string;
}

export interface IRpcUrlApi extends API {
  response: IRpcUrl[];
}
export interface IRpcUrl {
  rpcUrlId: number;
  rpcUrl: string;
  chain: IChains;
}
export interface IRpcUrlCreate {
  rpcUrlId: number;
  rpcUrl: string;
  chainId: number;
}

export interface IBotsAPI extends API {
  response: IBots[];
}
export interface IBots {
  botId: number;
  botName: string;
  description: string;
  server: IServers;
  job: IJobs;
  pairs: number;
  paused: boolean;
  isRepeat: boolean;
  delayBetweenRepeat: number;
  maxJobs: number;
  maxErrors: number;
  timeoutMs: number;
}
export interface IBotsCreate {
  botId: number;
  botName: string;
  description: string;
  serverId: number;
  jobId: number;
  paused: boolean;
  isRepeat: boolean;
  delayBetweenRepeat: number;
  maxJobs: number;
  maxErrors: number;
  timeoutMs: number;
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
