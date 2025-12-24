import {createFeatureSelector, createSelector} from '@ngrx/store';
import {DB_CONFIG_FEATURE_KEY, DbConfigState} from './db-config.reducer';

export const selectFeature = createFeatureSelector<DbConfigState>(DB_CONFIG_FEATURE_KEY);

export const getFeatureName = createSelector(
  selectFeature,
  (state: DbConfigState) => state.featureName
);
export const getVersionList = createSelector(
  selectFeature,
  (state: DbConfigState) => state.versions
);

//====================================================================================================================
//                                                   Tokens
//====================================================================================================================

export const getTokensDataResponse = createSelector(
  selectFeature,
  (state: DbConfigState) => state.tokens.response
);
export const getTokensDataFailure = createSelector(
  selectFeature,
  (state: DbConfigState) => state.tokens.error
);
export const getTokensDataIsFailure = createSelector(
  selectFeature,
  (state: DbConfigState) => !!state.tokens.error
);
export const getTokensDataIsLoading = createSelector(
  selectFeature,
  (state: DbConfigState) => state.tokens.isLoading
);
export const getTokensDataIsLoaded = createSelector(
  selectFeature,
  (state: DbConfigState) => state.tokens.isLoaded
);

//====================================================================================================================
//                                                   Pools
//====================================================================================================================

export const getPoolsDataResponse = createSelector(
  selectFeature,
  (state: DbConfigState) => state.pools.response
);
export const getPoolsDataFailure = createSelector(
  selectFeature,
  (state: DbConfigState) => state.pools.error
);
export const getPoolsDataIsFailure = createSelector(
  selectFeature,
  (state: DbConfigState) => !!state.pools.error
);
export const getPoolsDataIsLoading = createSelector(
  selectFeature,
  (state: DbConfigState) => state.pools.isLoading
);
export const getPoolsDataIsLoaded = createSelector(
  selectFeature,
  (state: DbConfigState) => state.pools.isLoaded
);

//====================================================================================================================
//                                                   Markets
//====================================================================================================================

export const getMarketsDataResponse = createSelector(
  selectFeature,
  (state: DbConfigState) => state.markets.response
);
export const getMarketsDataFailure = createSelector(
  selectFeature,
  (state: DbConfigState) => state.markets.error
);
export const getMarketsDataIsFailure = createSelector(
  selectFeature,
  (state: DbConfigState) => !!state.markets.error
);
export const getMarketsDataIsLoading = createSelector(
  selectFeature,
  (state: DbConfigState) => state.markets.isLoading
);
export const getMarketsDataIsLoaded = createSelector(
  selectFeature,
  (state: DbConfigState) => state.markets.isLoaded
);

//====================================================================================================================
//                                                   Dexes
//====================================================================================================================

export const getDexesDataResponse = createSelector(
  selectFeature,
  (state: DbConfigState) => state.dexes.response
);
export const getDexesDataFailure = createSelector(
  selectFeature,
  (state: DbConfigState) => state.dexes.error
);
export const getDexesDataIsFailure = createSelector(
  selectFeature,
  (state: DbConfigState) => !!state.dexes.error
);
export const getDexesDataIsLoading = createSelector(
  selectFeature,
  (state: DbConfigState) => state.dexes.isLoading
);
export const getDexesDataIsLoaded = createSelector(
  selectFeature,
  (state: DbConfigState) => state.dexes.isLoaded
);

//====================================================================================================================
//                                                   Chains
//====================================================================================================================

export const getChainsDataResponse = createSelector(
  selectFeature,
  (state: DbConfigState) => state.chains.response
);
export const getChainsDataFailure = createSelector(
  selectFeature,
  (state: DbConfigState) => state.chains.error
);
export const getChainsDataIsFailure = createSelector(
  selectFeature,
  (state: DbConfigState) => !!state.chains.error
);
export const getChainsDataIsLoading = createSelector(
  selectFeature,
  (state: DbConfigState) => state.chains.isLoading
);
export const getChainsDataIsLoaded = createSelector(
  selectFeature,
  (state: DbConfigState) => state.chains.isLoaded
);

//====================================================================================================================
//                                                   Pairs
//====================================================================================================================

export const getPairsDataResponse = createSelector(
  selectFeature,
  (state: DbConfigState) => state.pairs.response
);
export const getPairsDataFailure = createSelector(
  selectFeature,
  (state: DbConfigState) => state.pairs.error
);
export const getPairsDataIsFailure = createSelector(
  selectFeature,
  (state: DbConfigState) => !!state.pairs.error
);
export const getPairsDataIsLoading = createSelector(
  selectFeature,
  (state: DbConfigState) => state.pairs.isLoading
);
export const getPairsDataIsLoaded = createSelector(
  selectFeature,
  (state: DbConfigState) => state.pairs.isLoaded
);

//====================================================================================================================
//                                                   Quotes
//====================================================================================================================

export const getQuotesDataResponse = createSelector(
  selectFeature,
  (state: DbConfigState) => state.quotes.response
);
export const getQuotesDataFailure = createSelector(
  selectFeature,
  (state: DbConfigState) => state.quotes.error
);
export const getQuotesDataIsFailure = createSelector(
  selectFeature,
  (state: DbConfigState) => !!state.quotes.error
);
export const getQuotesDataIsLoading = createSelector(
  selectFeature,
  (state: DbConfigState) => state.quotes.isLoading
);
export const getQuotesDataIsLoaded = createSelector(
  selectFeature,
  (state: DbConfigState) => state.quotes.isLoaded
);

//====================================================================================================================
//                                                   Jobs
//====================================================================================================================

export const getJobsDataResponse = createSelector(
  selectFeature,
  (state: DbConfigState) => state.jobs.response
);
export const getJobsDataFailure = createSelector(
  selectFeature,
  (state: DbConfigState) => state.jobs.error
);
export const getJobsDataIsFailure = createSelector(
  selectFeature,
  (state: DbConfigState) => !!state.jobs.error
);
export const getJobsDataIsLoading = createSelector(
  selectFeature,
  (state: DbConfigState) => state.jobs.isLoading
);
export const getJobsDataIsLoaded = createSelector(
  selectFeature,
  (state: DbConfigState) => state.jobs.isLoaded
);

//====================================================================================================================
//                                                   Bots
//====================================================================================================================

export const getBotsDataResponse = createSelector(
  selectFeature,
  (state: DbConfigState) => state.bots.response
);
export const getBotsDataFailure = createSelector(
  selectFeature,
  (state: DbConfigState) => state.bots.error
);
export const getBotsDataIsFailure = createSelector(
  selectFeature,
  (state: DbConfigState) => !!state.bots.error
);
export const getBotsDataIsLoading = createSelector(
  selectFeature,
  (state: DbConfigState) => state.bots.isLoading
);
export const getBotsDataIsLoaded = createSelector(
  selectFeature,
  (state: DbConfigState) => state.bots.isLoaded
);

//====================================================================================================================
//                                                   Servers
//====================================================================================================================

export const getServersDataResponse = createSelector(
  selectFeature,
  (state: DbConfigState) => state.servers.response
);
export const getServersDataFailure = createSelector(
  selectFeature,
  (state: DbConfigState) => state.servers.error
);
export const getServersDataIsFailure = createSelector(
  selectFeature,
  (state: DbConfigState) => !!state.servers.error
);
export const getServersDataIsLoading = createSelector(
  selectFeature,
  (state: DbConfigState) => state.servers.isLoading
);
export const getServersDataIsLoaded = createSelector(
  selectFeature,
  (state: DbConfigState) => state.servers.isLoaded
);
