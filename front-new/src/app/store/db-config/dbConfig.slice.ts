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

const upsertListItem = (
  list: any[],
  item: any,
  getId: (row: any) => number,
  previousId?: number,
) => {
  const newId = getId(item);
  let next = [...list];
  if (previousId != null && Number.isFinite(previousId) && previousId !== newId) {
    next = next.filter((row) => getId(row) !== previousId);
  }
  const idx = next.findIndex((row) => getId(row) === newId);
  if (idx >= 0) {
    next[idx] = { ...next[idx], ...item };
  } else {
    next.unshift(item);
  }
  return next;
};

const getDexChainId = (chain: any) => Number(chain.chainId ?? chain.id);
const getCexChainId = (chain: any) => Number(chain.id ?? chain.chainId);
const getCexPairId = (pair: any) => Number(pair.id ?? pair.pairId ?? pair.cexPairId ?? pair.cex_pair_id);
const getCexJobId = (job: any) => Number(job.id ?? job.cexJobId ?? job.cex_job_id);
const getDexJobId = (job: any) => Number(job.jobId ?? job.id);
const getTokenId = (token: any) => Number(token.tokenId ?? token.id);
const getPoolId = (pool: any) => Number(pool.poolId ?? pool.id);
const getDexId = (dex: any) => Number(dex.dexId ?? dex.id);
const getRpcUrlId = (rpcUrl: any) => Number(rpcUrl.rpcUrlId ?? rpcUrl.id);
const getBotId = (bot: any) => Number(bot.botId ?? bot.id);
const getServerId = (server: any) => Number(server.serverId ?? server.id);

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
    removeTokensByIds(state, action: PayloadAction<number[]>) {
      const ids = new Set(action.payload.map((id) => Number(id)));
      if (ids.size === 0) return;
      state.tokens.response = (state.tokens.response ?? []).filter((token: any) => {
        const tokenId = Number(token.tokenId ?? token.id);
        return !ids.has(tokenId);
      });
    },
    upsertToken(state, action: PayloadAction<{ token: any }>) {
      state.tokens.response = upsertListItem(
        state.tokens.response ?? [],
        action.payload.token,
        getTokenId,
      );
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
    removePoolsByIds(state, action: PayloadAction<number[]>) {
      const ids = new Set(action.payload.map((id) => Number(id)));
      if (ids.size === 0) return;
      state.pools.response = (state.pools.response ?? []).filter((pool: any) => {
        const poolId = Number(pool.poolId ?? pool.id);
        return !ids.has(poolId);
      });
    },
    upsertPool(state, action: PayloadAction<{ pool: any }>) {
      state.pools.response = upsertListItem(
        state.pools.response ?? [],
        action.payload.pool,
        getPoolId,
      );
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
    removeDexesByIds(state, action: PayloadAction<number[]>) {
      const ids = new Set(action.payload.map((id) => Number(id)));
      if (ids.size === 0) return;
      state.dexes.response = (state.dexes.response ?? []).filter((dex: any) => {
        const dexId = Number(dex.dexId ?? dex.id);
        return !ids.has(dexId);
      });
    },
    upsertDex(state, action: PayloadAction<{ dex: any }>) {
      state.dexes.response = upsertListItem(
        state.dexes.response ?? [],
        action.payload.dex,
        getDexId,
      );
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
    removeChainsByIds(state, action: PayloadAction<number[]>) {
      const ids = new Set(action.payload.map((id) => Number(id)));
      if (ids.size === 0) return;
      state.chains.response = (state.chains.response ?? []).filter((chain: any) => {
        const chainId = Number(chain.chainId ?? chain.id);
        return !ids.has(chainId);
      });
    },
    upsertChain(state, action: PayloadAction<{ chain: any; previousId?: number }>) {
      state.chains.response = upsertListItem(
        state.chains.response ?? [],
        action.payload.chain,
        getDexChainId,
        action.payload.previousId,
      );
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
    removeJobsByIds(state, action: PayloadAction<number[]>) {
      const ids = new Set(action.payload.map((id) => Number(id)));
      if (ids.size === 0) return;
      state.jobs.response = (state.jobs.response ?? []).filter((job: any) => {
        const jobId = Number(job.jobId ?? job.id);
        return !ids.has(jobId);
      });
    },
    upsertJob(state, action: PayloadAction<{ job: any }>) {
      state.jobs.response = upsertListItem(
        state.jobs.response ?? [],
        action.payload.job,
        getDexJobId,
      );
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
    removeBotsByIds(state, action: PayloadAction<number[]>) {
      const ids = new Set(action.payload.map((id) => Number(id)));
      if (ids.size === 0) return;
      state.bots.response = (state.bots.response ?? []).filter((bot: any) => {
        const botId = Number(bot.botId ?? bot.id);
        return !ids.has(botId);
      });
    },
    upsertBot(state, action: PayloadAction<{ bot: any }>) {
      state.bots.response = upsertListItem(
        state.bots.response ?? [],
        action.payload.bot,
        getBotId,
      );
    },
    upsertBots(state, action: PayloadAction<{ bots: any[] }>) {
      let next = state.bots.response ?? [];
      for (const bot of action.payload.bots ?? []) {
        next = upsertListItem(next, bot, getBotId);
      }
      state.bots.response = next;
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
    removeServersByIds(state, action: PayloadAction<number[]>) {
      const ids = new Set(action.payload.map((id) => Number(id)));
      if (ids.size === 0) return;
      state.servers.response = (state.servers.response ?? []).filter((server: any) => {
        const serverId = Number(server.serverId ?? server.id);
        return !ids.has(serverId);
      });
    },
    upsertServer(state, action: PayloadAction<{ server: any }>) {
      state.servers.response = upsertListItem(
        state.servers.response ?? [],
        action.payload.server,
        getServerId,
      );
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
    removeRpcUrlsByIds(state, action: PayloadAction<number[]>) {
      const ids = new Set(action.payload.map((id) => Number(id)));
      if (ids.size === 0) return;
      state.rpcUrls.response = (state.rpcUrls.response ?? []).filter((rpcUrl: any) => {
        const rpcUrlId = Number(rpcUrl.rpcUrlId ?? rpcUrl.id);
        return !ids.has(rpcUrlId);
      });
    },
    upsertRpcUrl(state, action: PayloadAction<{ rpcUrl: any }>) {
      state.rpcUrls.response = upsertListItem(
        state.rpcUrls.response ?? [],
        action.payload.rpcUrl,
        getRpcUrlId,
      );
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
    upsertCexChain(state, action: PayloadAction<{ chain: any }>) {
      state.cexChains.response = upsertListItem(
        state.cexChains.response ?? [],
        action.payload.chain,
        getCexChainId,
      );
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
    upsertCexPair(state, action: PayloadAction<{ pair: any }>) {
      state.cexPairs.response = upsertListItem(
        state.cexPairs.response ?? [],
        action.payload.pair,
        getCexPairId,
      );
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
    removeCexJobsByIds(state, action: PayloadAction<number[]>) {
      const ids = new Set(action.payload.map((id) => Number(id)));
      if (ids.size === 0) return;
      state.cexJobs.response = (state.cexJobs.response ?? []).filter((job: any) => {
        const jobId = Number(job.id ?? job.cexJobId ?? job.cex_job_id);
        return !ids.has(jobId);
      });
    },
    upsertCexJob(state, action: PayloadAction<{ job: any }>) {
      state.cexJobs.response = upsertListItem(
        state.cexJobs.response ?? [],
        action.payload.job,
        getCexJobId,
      );
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

