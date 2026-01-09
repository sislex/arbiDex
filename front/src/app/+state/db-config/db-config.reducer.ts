import {createReducer, on} from '@ngrx/store';
import * as DbConfigActions from './db-config.actions';
import {
  IBotsAPI,
  IChainsAPI,
  IDexesAPI,
  IJobsAPI,
  IQuotesAPI,
  IPoolsAPI,
  IServersAPI,
  ITokensAPI,
  IPairsAPI,
  IRpcUrlApi,
} from '../../models/db-config';
import {emptyAsyncResponse} from './configs';

export const DB_CONFIG_FEATURE_KEY = 'db_config';

export interface DbConfigState {
  featureName: string;
  tokens: ITokensAPI;
  pools: IPoolsAPI;
  dexes: IDexesAPI;
  chains: IChainsAPI;
  pairs: IPairsAPI;
  quotes: IQuotesAPI;
  jobs: IJobsAPI;
  bots: IBotsAPI;
  servers: IServersAPI;
  rpcUrls: IRpcUrlApi;

  versions: string[];
}

export interface DbConfigPartialState {
  readonly [DB_CONFIG_FEATURE_KEY]: DbConfigState;
}

export const initialState: DbConfigState = {
  featureName: 'database',
  tokens: emptyAsyncResponse([]),
  pools: emptyAsyncResponse([]),
  dexes: emptyAsyncResponse([]),
  chains: emptyAsyncResponse([]),
  pairs: emptyAsyncResponse([]),
  quotes: emptyAsyncResponse([]),
  jobs: emptyAsyncResponse([]),
  bots: emptyAsyncResponse([]),
  servers: emptyAsyncResponse([]),
  rpcUrls: emptyAsyncResponse([]),

  versions: ['v2', 'v3', 'v4'],
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

  on(DbConfigActions.setPairsData, (state) => ({
    ...state,
    pairs: {
      ...state.pairs,
      startTime:  Date.now(),
      isLoading: true,
      isLoaded: false,
    }
  })),
  on(DbConfigActions.setPairsDataSuccess, (state, {response}) => ({
    ...state,
    pairs: {
      ...state.pairs,
      loadingTime: Date.now() - state.pairs.startTime!,
      isLoading: false,
      isLoaded: true,
      response
    }
  })),
  on(DbConfigActions.setPairsDataFailure, (state, {error}) => ({
    ...state,
    pairs: {
      ...state.pairs,
      loadingTime: Date.now() - state.pairs.startTime!,
      isLoading: false,
      isLoaded: true,
      error
    }
  })),

  on(DbConfigActions.setQuotesData, (state) => ({
    ...state,
    quotes: {
      ...state.quotes,
      startTime:  Date.now(),
      isLoading: true,
      isLoaded: false,
    }
  })),
  on(DbConfigActions.setQuotesDataSuccess, (state, {response}) => ({
    ...state,
    quotes: {
      ...state.quotes,
      loadingTime: Date.now() - state.quotes.startTime!,
      isLoading: false,
      isLoaded: true,
      response
    }
  })),
  on(DbConfigActions.setQuotesDataFailure, (state, {error}) => ({
    ...state,
    quotes: {
      ...state.quotes,
      loadingTime: Date.now() - state.quotes.startTime!,
      isLoading: false,
      isLoaded: true,
      error
    }
  })),

  on(DbConfigActions.setJobsData, (state) => ({
    ...state,
    jobs: {
      ...state.jobs,
      startTime:  Date.now(),
      isLoading: true,
      isLoaded: false,
    }
  })),
  on(DbConfigActions.setJobsDataSuccess, (state, {response}) => ({
    ...state,
    jobs: {
      ...state.jobs,
      loadingTime: Date.now() - state.jobs.startTime!,
      isLoading: false,
      isLoaded: true,
      response
    }
  })),
  on(DbConfigActions.setJobsDataFailure, (state, {error}) => ({
    ...state,
    jobs: {
      ...state.jobs,
      loadingTime: Date.now() - state.jobs.startTime!,
      isLoading: false,
      isLoaded: true,
      error
    }
  })),

  on(DbConfigActions.setBotsData, (state) => ({
    ...state,
    bots: {
      ...state.bots,
      startTime:  Date.now(),
      isLoading: true,
      isLoaded: false,
    }
  })),
  on(DbConfigActions.setBotsDataSuccess, (state, {response}) => ({
    ...state,
    bots: {
      ...state.bots,
      loadingTime: Date.now() - state.bots.startTime!,
      isLoading: false,
      isLoaded: true,
      response
    }
  })),
  on(DbConfigActions.setBotsDataFailure, (state, {error}) => ({
    ...state,
    bots: {
      ...state.bots,
      loadingTime: Date.now() - state.bots.startTime!,
      isLoading: false,
      isLoaded: true,
      error
    }
  })),

  on(DbConfigActions.setServersData, (state) => ({
    ...state,
    servers: {
      ...state.servers,
      startTime:  Date.now(),
      isLoading: true,
      isLoaded: false,
    }
  })),
  on(DbConfigActions.setServersDataSuccess, (state, {response}) => ({
    ...state,
    servers: {
      ...state.servers,
      loadingTime: Date.now() - state.servers.startTime!,
      isLoading: false,
      isLoaded: true,
      response
    }
  })),
  on(DbConfigActions.setServersDataFailure, (state, {error}) => ({
    ...state,
    servers: {
      ...state.servers,
      loadingTime: Date.now() - state.servers.startTime!,
      isLoading: false,
      isLoaded: true,
      error
    }
  })),
)
