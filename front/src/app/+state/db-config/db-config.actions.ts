import { createAction, props } from '@ngrx/store';
import {
  IChainsCreate,
  IDexesCreate,
  IJobsCreate,
  IPoolsCreate,
  IQuotesCreate,
  ITokensCreate,
  IBotsCreate,
  IServersCreate,
  IPairsCreate, IRpcUrlCreate,
} from '../../models/db-config';

export const setServerList = createAction('[DbConfig] setServerList');

//====================================================================================================================
//                                                   Tokens
//====================================================================================================================

export const setTokensData = createAction('[DbConfig] setTokensData');
export const setTokensDataSuccess = createAction(
  '[DbConfig] setTokensDataSuccess',
  props<{ response: any }>()
);
export const setTokensDataFailure = createAction(
  '[DbConfig] setTokensDataFailure',
  props<{ error: string }>()
);
export const createToken = createAction(
  '[DbConfig] createToken',
  props<{ data: ITokensCreate }>()
);
export const editToken = createAction(
  '[DbConfig] editToken',
  props<{ data: ITokensCreate }>()
);
export const deletingToken = createAction(
  '[DbConfig] deletingToken',
  props<{ tokenId: number }>()
);

//====================================================================================================================
//                                                   Pools
//====================================================================================================================

export const setPoolsData = createAction('[DbConfig] setPoolsData');
export const setPoolsDataSuccess = createAction(
  '[DbConfig] setPoolsDataSuccess',
  props<{ response: any }>()
);
export const setPoolsDataFailure = createAction(
  '[DbConfig] setPoolsDataFailure',
  props<{ error: string }>()
);
export const createPool = createAction(
  '[DbConfig] createPool',
  props<{ data: IPoolsCreate }>()
);
export const editPool = createAction(
  '[DbConfig] editPool',
  props<{ data: IPoolsCreate }>()
);
export const deletingPools = createAction(
  '[DbConfig] deletingPools',
  props<{ poolId: number }>()
);

//====================================================================================================================
//                                                   Dexes
//====================================================================================================================

export const setDexesData = createAction('[DbConfig] setDexesData');
export const setDexesDataSuccess = createAction(
  '[DbConfig] setDexesDataSuccess',
  props<{ response: any }>()
);
export const setDexesDataFailure = createAction(
  '[DbConfig] setDexesDataFailure',
  props<{ error: string }>()
);
export const createDex = createAction(
  '[DbConfig] createDex',
  props<{ data: IDexesCreate }>()
);
export const editDex = createAction(
  '[DbConfig] editDex',
  props<{ data: IDexesCreate }>()
);
export const deletingDex = createAction(
  '[DbConfig] deletingDex',
  props<{ dexId: number }>()
);

//====================================================================================================================
//                                                   Chains
//====================================================================================================================

export const setChainsData = createAction('[DbConfig] setChainsData');
export const setChainsDataSuccess = createAction(
  '[DbConfig] setChainsDataSuccess',
  props<{ response: any }>()
);
export const setChainsDataFailure = createAction(
  '[DbConfig] setChainsDataFailure',
  props<{ error: string }>()
);
export const createChain = createAction(
  '[DbConfig] createChain',
  props<{ data: IChainsCreate }>()
);
export const editChain = createAction(
  '[DbConfig] editChain',
  props<{ data: IChainsCreate }>()
);
export const deletingChain = createAction(
  '[DbConfig] deletingChain',
  props<{ chainId: number }>()
);

//====================================================================================================================
//                                                   Pairs
//====================================================================================================================

export const setPairsData = createAction('[DbConfig] setPairsData');
export const setPairsDataSuccess = createAction(
  '[DbConfig] setPairsDataSuccess',
  props<{ response: any }>()
);
export const setPairsDataFailure = createAction(
  '[DbConfig] setPairsDataFailure',
  props<{ error: string }>()
);
export const createPair = createAction(
  '[DbConfig] createPair',
  props<{ data: IPairsCreate }>()
);
export const editPair = createAction(
  '[DbConfig] editPair',
  props<{ data: IPairsCreate }>()
);
export const deletingPair = createAction(
  '[DbConfig] deletingPair',
  props<{ pairId: number }>()
);

//====================================================================================================================
//                                                   Quotes
//====================================================================================================================

export const setQuotesData = createAction('[DbConfig] setQuotesData');
export const setQuotesDataSuccess = createAction(
  '[DbConfig] setQuotesDataSuccess',
  props<{ response: any }>()
);
export const setQuotesDataFailure = createAction(
  '[DbConfig] setQuotesDataFailure',
  props<{ error: string }>()
);
export const createQuote = createAction(
  '[DbConfig] createQuote',
  props<{ data: IQuotesCreate }>()
);
export const editQuote = createAction(
  '[DbConfig] editQuote',
  props<{ data: IQuotesCreate }>()
);
export const deletingQuote = createAction(
  '[DbConfig] deletingQuote',
  props<{ quoteId: number }>()
);

//====================================================================================================================
//                                                   Jobs
//====================================================================================================================

export const setJobsData = createAction('[DbConfig] setJobsData');
export const setJobsDataSuccess = createAction(
  '[DbConfig] setJobsDataSuccess',
  props<{ response: any }>()
);
export const setJobsDataFailure = createAction(
  '[DbConfig] setJobsDataFailure',
  props<{ error: string }>()
);
export const createJob = createAction(
  '[DbConfig] createJob',
  props<{ data: IJobsCreate }>()
);
export const editJob = createAction(
  '[DbConfig] editJob',
  props<{ data: IJobsCreate }>()
);
export const deletingJob = createAction(
  '[DbConfig] deletingJob',
  props<{ jobId: number }>()
);

//====================================================================================================================
//                                                   Bots
//====================================================================================================================

export const setBotsData = createAction('[DbConfig] setBotsData');
export const setBotsDataSuccess = createAction(
  '[DbConfig] setBotsDataSuccess',
  props<{ response: any }>()
);
export const setBotsDataFailure = createAction(
  '[DbConfig] setBotsDataFailure',
  props<{ error: string }>()
);
export const createBot = createAction(
  '[DbConfig] createBot',
  props<{ data: IBotsCreate }>()
);
export const editBot = createAction(
  '[DbConfig] editBot',
  props<{ data: IBotsCreate }>()
);
export const deletingBot = createAction(
  '[DbConfig] deletingBot',
  props<{ botId: number }>()
);

//====================================================================================================================
//                                                   Servers
//====================================================================================================================

export const setServersData = createAction('[DbConfig] setServersData');
export const setServersDataSuccess = createAction(
  '[DbConfig] setServersDataSuccess',
  props<{ response: any }>()
);
export const setServersDataFailure = createAction(
  '[DbConfig] setServersDataFailure',
  props<{ error: string }>()
);
export const createServer = createAction(
  '[DbConfig] createServer',
  props<{ data: IServersCreate }>()
);
export const editServer = createAction(
  '[DbConfig] editServer',
  props<{ data: IServersCreate }>()
);
export const deletingServer = createAction(
  '[DbConfig] deletingServer',
  props<{ serverId: number }>()
);

//====================================================================================================================
//                                                   Rpc Urls
//====================================================================================================================

export const setRpcUrlsData = createAction('[DbConfig] setRpcUrlsData');
export const setRpcUrlsDataSuccess = createAction(
  '[DbConfig] setRpcUrlsDataSuccess',
  props<{ response: any }>()
);
export const setRpcUrlsDataFailure = createAction(
  '[DbConfig] setRpcUrlsDataFailure',
  props<{ error: string }>()
);
export const createRpcUrl = createAction(
  '[DbConfig] createRpcUrl',
  props<{ data: IRpcUrlCreate }>()
);
export const editRpcUrl = createAction(
  '[DbConfig] editRpcUrl',
  props<{ data: IRpcUrlCreate }>()
);
export const deletingRpcUrl = createAction(
  '[DbConfig] deletingRpcUrl',
  props<{ rpcUrlId: number }>()
);
