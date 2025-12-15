import {createFeatureSelector, createSelector} from '@ngrx/store';
import {DB_CONFIG_FEATURE_KEY, DbConfigState} from './db-config.reducer';

export const selectFeature = createFeatureSelector<DbConfigState>(DB_CONFIG_FEATURE_KEY);

export const getFeatureName = createSelector(
  selectFeature,
  (state: DbConfigState) => state.featureName
);

// Tokens
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

// Pools
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

// Markets
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

// Dexes
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

// Chains
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
