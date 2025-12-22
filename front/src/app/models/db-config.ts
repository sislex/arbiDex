import {API} from './api';

export interface ITokensAPI extends API {
  response: ITokens[];
}

export interface IPoolsAPI extends API {
  response: IPools[];
}

export interface IMarketsAPI extends API {
  response: IMarkets[];
}

export interface IDexesAPI extends API {
  response: IDexes[];
}

export interface IChainsAPI extends API {
  response: IChains[];
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

export interface IPools {
  poolId: number;
  chainId: number;
  poolAddress: number;
  token: number;
  token_2: number;
  fee: number;
  dexId: number;
  version: string;
}

export interface IPoolsCreate {
  poolId: number;
  chainId: number;
  poolAddress: number;
  token: number;
  token_2: number;
  fee: number;
  dexId: number;
  version: string;
}

export interface IMarkets {
  marketId: number;
  poolId: number;
  amount: string;
}

export interface IMarketsCreate {
  marketId: number;
  poolId: number;
  amount: string;
}

export interface IDexes {
  dexId: number;
  name: string;
}

export interface IDexesCreate {
  dexId: number;
  name: string;
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
  id: string;
  name: string;
}
