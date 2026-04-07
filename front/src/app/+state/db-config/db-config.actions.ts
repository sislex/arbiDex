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
  IPairsCreate,
  IRpcUrlCreate, ICexJobsCreate, ICexPairsCreate, ICexChainsCreate
} from '../../models/db-config';

export const setServerList = createAction('[DbConfig] setServerList');

//====================================================================================================================
//                                                   Tokens
//====================================================================================================================

export const setTokensData = createAction('[DbConfig] setTokensData');
export const initTokensListPage = createAction('[DbConfig] initTokensListPage');
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

export const initPoolsPage = createAction('[DbConfig] initPoolsPage');
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

export const initPairsPage = createAction('[DbConfig] initPairsPage');
export const setPairsData = createAction('[DbConfig] setPairsData');
export const setPairsRatingData = createAction(
  '[DbConfig] setPairsRatingData',
  props<{ pairIdForRating: number }>()

);
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
export const initQuotesListPage = createAction('[DbConfig] initQuotesListPage');
export const setOneQuoteData = createAction(
  '[DbConfig] setOneQuoteData',
  props<{ id: number }>()
);
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
export const initJobsListPage = createAction('[DbConfig] initJobsListPage');
export const setOneJobData = createAction(
  '[DbConfig] setOneJobData',
  props<{ jobId: number }>()
);
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
export const initBotsListPage = createAction('[DbConfig] initBotsListPage');

export const setBotsDataSuccess = createAction(
  '[DbConfig] setBotsDataSuccess',
  props<{ response: any }>()
);
export const setBotsDataFailure = createAction(
  '[DbConfig] setBotsDataFailure',
  props<{ error: string }>()
);

export const setBotsByServerId = createAction(
  '[DbConfig] setBotsByServerId',
  props<{ serverId: number }>()
);
export const setBotsByServerIdSuccess = createAction(
  '[DbConfig] setBotsByServerIdSuccess',
  props<{ response: any }>()
);
export const setBotsByServerIdFailure = createAction(
  '[DbConfig] setBotsByServerIdFailure',
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

//====================================================================================================================
//                                                   Swap Rate
//====================================================================================================================

export const setSwapRate = createAction('[DbConfig] setSwapRate');
export const setSwapRateDataSuccess = createAction(
  '[DbConfig] setSwapRateDataSuccess',
  props<{ response: any }>()
);
export const setSwapRateDataFailure = createAction(
  '[DbConfig] setSwapRateDataFailure',
  props<{ error: string }>()
);
export const conversionTo = createAction(
  '[DbConfig] conversionTo',
  props<{ id: number }>()
);

export const setReservesInCurrentToken = createAction(
  '[DbConfig] setReservesInCurrentToken',
  props<{ currentToken: number }>()
);
export const setReservesInCurrentTokenSuccess = createAction(
  '[DbConfig] setReservesInCurrentTokenSuccess',
  props<{ response: any }>()
);
export const setReservesInCurrentTokenFailure = createAction(
  '[DbConfig] setReservesInCurrentTokenFailure',
  props<{ error: string }>()
);
export const updateFullPoolsDataSuccess = createAction(
  '[DbConfig] updateFullPoolsDataSuccess',
  props<{ pools: any }>()
);
export const updateFullPoolsDataFailure = createAction(
  '[DbConfig] updateFullPoolsDataFailure',
  props<{ error: string }>()
);


//====================================================================================================================
//                                                   Cex Chains
//====================================================================================================================

export const setCexChainsData = createAction('[DbConfig] setCexChainsData');
export const setCexChainsDataSuccess = createAction(
  '[DbConfig] setCexChainsDataSuccess',
  props<{ response: any }>()
);
export const setCexChainsDataFailure = createAction(
  '[DbConfig] setCexChainsDataFailure',
  props<{ error: string }>()
);
export const createCexChain = createAction(
  '[DbConfig] createCexChain',
  props<{ data: ICexChainsCreate }>()
);
export const editCexChain = createAction(
  '[DbConfig] editCexChain',
  props<{ data: ICexChainsCreate }>()
);
export const deletingCexChain = createAction(
  '[DbConfig] deletingCexChain',
  props<{ chainId: number }>()
);

//====================================================================================================================
//                                                   Cex Pairs
//====================================================================================================================

export const initCexPairsPage = createAction('[DbConfig] initCexPairsPage');
export const setCexPairsData = createAction('[DbConfig] setCexPairsData');
export const setCexPairsRatingData = createAction(
  '[DbConfig] setCexPairsRatingData',
  props<{ cexPairIdForRating: number }>()

);
export const setCexPairsDataSuccess = createAction(
  '[DbConfig] setCexPairsDataSuccess',
  props<{ response: any }>()
);
export const setCexPairsDataFailure = createAction(
  '[DbConfig] setCexPairsDataFailure',
  props<{ error: string }>()
);
export const createCexPair = createAction(
  '[DbConfig] createCexPair',
  props<{ data: ICexPairsCreate }>()
);
export const editCexPair = createAction(
  '[DbConfig] editCexPair',
  props<{ data: ICexPairsCreate }>()
);
export const deletingCexPair = createAction(
  '[DbConfig] deletingCexPair',
  props<{ cexPairId: number }>()
);


//====================================================================================================================
//                                                   Cex Jobs
//====================================================================================================================

export const setCexJobsData = createAction('[DbConfig] setCexJobsData');
export const refreshCexJobsData = createAction('[DbConfig] refreshCexJobsData');
export const initCexJobsListPage = createAction('[DbConfig] initCexJobsListPage');
export const setCexOneJobData = createAction(
  '[DbConfig] setCexOneJobData',
  props<{ cexJobId: number }>()
);
export const setCexJobsDataSuccess = createAction(
  '[DbConfig] setCexJobsDataSuccess',
  props<{ response: any }>()
);
export const setCexJobsDataFailure = createAction(
  '[DbConfig] setCexJobsDataFailure',
  props<{ error: string }>()
);

export const createCexJob = createAction(
  '[DbConfig] createCexJob',
  props<{ data: ICexJobsCreate }>()
);
export const editCexJob = createAction(
  '[DbConfig] editCexJob',
  props<{ data: ICexJobsCreate }>()
);
export const deletingCexJob = createAction(
  '[DbConfig] deletingCexJob',
  props<{ cexJobId: number }>()
)

export const checkCexJob = createAction(
  '[DbConfig] checkCexJob',
  props<{ cexData: any }>()
);
export const checkCexJobsSuccess = createAction(
  '[DbConfig] checkCexJobsSuccess',
  props<{ response: any }>()
);
export const checkCexJobsFailure = createAction(
  '[DbConfig] checkCexJobsFailure',
  props<{ error: string }>()
);
