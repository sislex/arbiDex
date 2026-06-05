import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export const DB_CONFIG_FEATURE_KEY = "dbConfig";

export interface AsyncState<T> {
  response: T;
  isLoading: boolean;
  isLoaded: boolean;
  error: string | null;
  startTime: number | null;
  loadingTime: number | null;
}

export interface DbConfigState {
  featureName: string;
  tokens: AsyncState<any[]>;
  pools: AsyncState<any[]>;
  dexes: AsyncState<any[]>;
  chains: AsyncState<any[]>;
  jobs: AsyncState<any[]>;
  bots: AsyncState<any[]>;
  botsByServerId: AsyncState<any[]>;
  servers: AsyncState<any[]>;
  rpcUrls: AsyncState<any[]>;
  swapRate: AsyncState<any[]>;
  cexChains: AsyncState<any[]>;
  cexPairs: AsyncState<any[]>;
  cexJobs: AsyncState<any[]>;
  versions: string[];
}

const emptyAsyncResponse = <T>(response: T): AsyncState<T> => ({
  response,
  isLoading: false,
  isLoaded: false,
  error: null,
  startTime: null,
  loadingTime: null,
});

const setLoading = (state: AsyncState<any[]>) => {
  state.startTime = Date.now();
  state.isLoading = true;
  state.isLoaded = false;
  state.error = null;
};

const setSuccess = (state: AsyncState<any[]>, response: any[]) => {
  state.loadingTime = state.startTime ? Date.now() - state.startTime : null;
  state.isLoading = false;
  state.isLoaded = true;
  state.response = response;
  state.error = null;
};

const setFailure = (state: AsyncState<any[]>, error: string) => {
  state.loadingTime = state.startTime ? Date.now() - state.startTime : null;
  state.isLoading = false;
  state.isLoaded = true;
  state.error = error;
};

export const initialState: DbConfigState = {
  featureName: "database",
  tokens: emptyAsyncResponse([]),
  pools: emptyAsyncResponse([]),
  dexes: emptyAsyncResponse([]),
  chains: emptyAsyncResponse([]),
  jobs: emptyAsyncResponse([]),
  bots: emptyAsyncResponse([]),
  botsByServerId: emptyAsyncResponse([]),
  servers: emptyAsyncResponse([]),
  rpcUrls: emptyAsyncResponse([]),
  swapRate: emptyAsyncResponse([]),
  cexChains: emptyAsyncResponse([]),
  cexPairs: emptyAsyncResponse([]),
  cexJobs: emptyAsyncResponse([]),
  versions: ["v2", "v3", "v4"],
};

const dbConfigSlice = createSlice({
  name: DB_CONFIG_FEATURE_KEY,
  initialState,
  reducers: {
    setFeatureName(state, action: PayloadAction<string>) {
      state.featureName = action.payload;
    },

    initTokensListPage() {},
    initPoolsPage() {},
    initJobsListPage() {},
    initBotsListPage() {},
    initCexPairsPage() {},
    initCexJobsListPage() {},

    setTokensData(state) {
      setLoading(state.tokens);
    },
    setTokensDataSuccess(state, action: PayloadAction<any[]>) {
      setSuccess(state.tokens, action.payload);
    },
    setTokensDataFailure(state, action: PayloadAction<string>) {
      setFailure(state.tokens, action.payload);
    },

    setPoolsData(state) {
      setLoading(state.pools);
    },
    setPoolsDataSuccess(state, action: PayloadAction<any[]>) {
      setSuccess(state.pools, action.payload);
    },
    setPoolsDataFailure(state, action: PayloadAction<string>) {
      setFailure(state.pools, action.payload);
    },

    setDexesData(state) {
      setLoading(state.dexes);
    },
    setDexesDataSuccess(state, action: PayloadAction<any[]>) {
      setSuccess(state.dexes, action.payload);
    },
    setDexesDataFailure(state, action: PayloadAction<string>) {
      setFailure(state.dexes, action.payload);
    },

    setChainsData(state) {
      setLoading(state.chains);
    },
    setChainsDataSuccess(state, action: PayloadAction<any[]>) {
      setSuccess(state.chains, action.payload);
    },
    setChainsDataFailure(state, action: PayloadAction<string>) {
      setFailure(state.chains, action.payload);
    },

    setJobsData(state) {
      setLoading(state.jobs);
    },
    setJobsDataSuccess(state, action: PayloadAction<any[]>) {
      setSuccess(state.jobs, action.payload);
    },
    setJobsDataFailure(state, action: PayloadAction<string>) {
      setFailure(state.jobs, action.payload);
    },

    setBotsData(state) {
      setLoading(state.bots);
    },
    setBotsDataSuccess(state, action: PayloadAction<any[]>) {
      setSuccess(state.bots, action.payload);
    },
    setBotsDataFailure(state, action: PayloadAction<string>) {
      setFailure(state.bots, action.payload);
    },

    setBotsByServerId(state) {
      setLoading(state.botsByServerId);
    },
    setBotsByServerIdSuccess(state, action: PayloadAction<any[]>) {
      setSuccess(state.botsByServerId, action.payload);
    },
    setBotsByServerIdFailure(state, action: PayloadAction<string>) {
      setFailure(state.botsByServerId, action.payload);
    },

    setServersData(state) {
      setLoading(state.servers);
    },
    setServersDataSuccess(state, action: PayloadAction<any[]>) {
      setSuccess(state.servers, action.payload);
    },
    setServersDataFailure(state, action: PayloadAction<string>) {
      setFailure(state.servers, action.payload);
    },

    setRpcUrlsData(state) {
      setLoading(state.rpcUrls);
    },
    setRpcUrlsDataSuccess(state, action: PayloadAction<any[]>) {
      setSuccess(state.rpcUrls, action.payload);
    },
    setRpcUrlsDataFailure(state, action: PayloadAction<string>) {
      setFailure(state.rpcUrls, action.payload);
    },

    setSwapRate(state) {
      setLoading(state.swapRate);
    },
    setSwapRateDataSuccess(state, action: PayloadAction<any[]>) {
      setSuccess(state.swapRate, action.payload);
    },
    setSwapRateDataFailure(state, action: PayloadAction<string>) {
      setFailure(state.swapRate, action.payload);
    },

    setCexChainsData(state) {
      setLoading(state.cexChains);
    },
    setCexChainsDataSuccess(state, action: PayloadAction<any[]>) {
      setSuccess(state.cexChains, action.payload);
    },
    setCexChainsDataFailure(state, action: PayloadAction<string>) {
      setFailure(state.cexChains, action.payload);
    },
    removeCexChainsByIds(state, action: PayloadAction<number[]>) {
      const ids = new Set(action.payload.map((id) => Number(id)));
      if (ids.size === 0) return;
      state.cexChains.response = (state.cexChains.response ?? []).filter((chain: any) => {
        const chainId = Number(chain.id ?? chain.chainId);
        return !ids.has(chainId);
      });
    },

    setCexPairsData(state) {
      setLoading(state.cexPairs);
    },
    setCexPairsDataSuccess(state, action: PayloadAction<any[]>) {
      setSuccess(state.cexPairs, action.payload);
    },
    setCexPairsDataFailure(state, action: PayloadAction<string>) {
      setFailure(state.cexPairs, action.payload);
    },
    removeCexPairsByIds(state, action: PayloadAction<number[]>) {
      const ids = new Set(action.payload.map((id) => Number(id)));
      if (ids.size === 0) return;
      state.cexPairs.response = (state.cexPairs.response ?? []).filter((pair: any) => {
        const pairId = Number(pair.id ?? pair.pairId ?? pair.cexPairId ?? pair.cex_pair_id);
        return !ids.has(pairId);
      });
    },

    setCexJobsData(state) {
      setLoading(state.cexJobs);
    },
    setCexJobsDataSuccess(state, action: PayloadAction<any[]>) {
      setSuccess(state.cexJobs, action.payload);
    },
    setCexJobsDataFailure(state, action: PayloadAction<string>) {
      setFailure(state.cexJobs, action.payload);
    },

    refetchTokensData(state) {
      setLoading(state.tokens);
    },
    refetchPoolsData(state) {
      setLoading(state.pools);
    },
    refetchDexesData(state) {
      setLoading(state.dexes);
    },
    refetchChainsData(state) {
      setLoading(state.chains);
    },
    refetchJobsData(state) {
      setLoading(state.jobs);
    },
    refetchBotsData(state) {
      setLoading(state.bots);
    },
    refetchServersData(state) {
      setLoading(state.servers);
    },
    refetchRpcUrlsData(state) {
      setLoading(state.rpcUrls);
    },
    refetchSwapRate(state) {
      setLoading(state.swapRate);
    },
    refetchCexChainsData(state) {
      setLoading(state.cexChains);
    },
    refetchCexPairsData(state) {
      setLoading(state.cexPairs);
    },
    refetchCexJobsData(state) {
      setLoading(state.cexJobs);
    },

    refetchPoolsPageResources(state) {
      setLoading(state.pools);
      setLoading(state.tokens);
      setLoading(state.dexes);
      setLoading(state.chains);
      setLoading(state.swapRate);
    },
    refetchJobsListPageResources(state) {
      setLoading(state.jobs);
      setLoading(state.chains);
      setLoading(state.rpcUrls);
    },
    refetchBotsListPageResources(state) {
      setLoading(state.bots);
      setLoading(state.jobs);
      setLoading(state.servers);
      setLoading(state.cexJobs);
    },
    refetchCexPairsPageResources(state) {
      setLoading(state.cexPairs);
      setLoading(state.cexChains);
    },
    refetchCexJobsListPageResources(state) {
      setLoading(state.cexJobs);
      setLoading(state.cexChains);
      setLoading(state.cexPairs);
    },
    refetchTokensListPageResources(state) {
      setLoading(state.tokens);
      setLoading(state.chains);
    },
  },
});

export const dbConfigActions = dbConfigSlice.actions;
export const dbConfigReducer = dbConfigSlice.reducer;

