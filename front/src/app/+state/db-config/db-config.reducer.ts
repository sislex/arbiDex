import {createReducer, on} from '@ngrx/store';
import * as DbConfigActions from './db-config.actions';
import {IChainsAPI, IDexesAPI, IMarketsAPI, IPoolsAPI, ITokensAPI} from '../../models/db-config';
import {emptyAsyncResponse} from './configs';

export const DB_CONFIG_FEATURE_KEY = 'db_config';

export interface DbConfigState {
  featureName: string;
  tokens: ITokensAPI;
  pools: IPoolsAPI;
  markets: IMarketsAPI;
  dexes: IDexesAPI;
  chains: IChainsAPI;
}

export interface DbConfigPartialState {
  readonly [DB_CONFIG_FEATURE_KEY]: DbConfigState;
}

export const initialState: DbConfigState = {
  featureName: 'database',
  tokens: emptyAsyncResponse([]),
  pools: emptyAsyncResponse([]),
  markets: emptyAsyncResponse([]),
  dexes: emptyAsyncResponse([]),
  chains: emptyAsyncResponse([]),
}

export const dbConfigReducer = createReducer(
  initialState,

  on(DbConfigActions.setTokensData, (state) => ({
    ...state,
    tokens: {
      ...state.tokens,
      startTime:  Date.now(),
      isLoading: true,
      isLoaded: false,
    }
  })),
  on(DbConfigActions.setTokensDataSuccess, (state, {response}) => ({
    ...state,
    tokens: {
      ...state.tokens,
      loadingTime: Date.now() - state.tokens.startTime!,
      isLoading: false,
      isLoaded: true,
      response
    }
  })),
  on(DbConfigActions.setTokensDataFailure, (state, {error}) => ({
    ...state,
    tokens: {
      ...state.tokens,
      loadingTime: Date.now() - state.tokens.startTime!,
      isLoading: false,
      isLoaded: true,
      error
    }
  })),

  on(DbConfigActions.setPoolsData, (state) => ({
    ...state,
    pools: {
      ...state.pools,
      startTime:  Date.now(),
      isLoading: true,
      isLoaded: false,
    }
  })),
  on(DbConfigActions.setPoolsDataSuccess, (state, {response}) => ({
    ...state,
    pools: {
      ...state.pools,
      loadingTime: Date.now() - state.pools.startTime!,
      isLoading: false,
      isLoaded: true,
      response
    }
  })),
  on(DbConfigActions.setPoolsDataFailure, (state, {error}) => ({
    ...state,
    pools: {
      ...state.pools,
      loadingTime: Date.now() - state.pools.startTime!,
      isLoading: false,
      isLoaded: true,
      error
    }
  })),

  on(DbConfigActions.setMarketsData, (state) => ({
    ...state,
    markets: {
      ...state.markets,
      startTime:  Date.now(),
      isLoading: true,
      isLoaded: false,
    }
  })),
  on(DbConfigActions.setMarketsDataSuccess, (state, {response}) => ({
    ...state,
    markets: {
      ...state.markets,
      loadingTime: Date.now() - state.markets.startTime!,
      isLoading: false,
      isLoaded: true,
      response
    }
  })),
  on(DbConfigActions.setMarketsDataFailure, (state, {error}) => ({
    ...state,
    markets: {
      ...state.markets,
      loadingTime: Date.now() - state.markets.startTime!,
      isLoading: false,
      isLoaded: true,
      error
    }
  })),

  on(DbConfigActions.setDexesData, (state) => ({
    ...state,
    dexes: {
      ...state.dexes,
      startTime:  Date.now(),
      isLoading: true,
      isLoaded: false,
    }
  })),
  on(DbConfigActions.setDexesDataSuccess, (state, {response}) => ({
    ...state,
    dexes: {
      ...state.dexes,
      loadingTime: Date.now() - state.dexes.startTime!,
      isLoading: false,
      isLoaded: true,
      response
    }
  })),
  on(DbConfigActions.setDexesDataFailure, (state, {error}) => ({
    ...state,
    dexes: {
      ...state.dexes,
      loadingTime: Date.now() - state.dexes.startTime!,
      isLoading: false,
      isLoaded: true,
      error
    }
  })),

  on(DbConfigActions.setChainsData, (state) => ({
    ...state,
    chains: {
      ...state.chains,
      startTime:  Date.now(),
      isLoading: true,
      isLoaded: false,
    }
  })),
  on(DbConfigActions.setChainsDataSuccess, (state, {response}) => ({
    ...state,
    chains: {
      ...state.chains,
      loadingTime: Date.now() - state.chains.startTime!,
      isLoading: false,
      isLoaded: true,
      response
    }
  })),
  on(DbConfigActions.setChainsDataFailure, (state, {error}) => ({
    ...state,
    chains: {
      ...state.chains,
      loadingTime: Date.now() - state.chains.startTime!,
      isLoading: false,
      isLoaded: true,
      error
    }
  })),
)
