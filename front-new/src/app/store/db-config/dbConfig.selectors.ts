import { createSelector } from "@reduxjs/toolkit";

type RootState = { dbConfig: any };

export const selectDbConfigFeature = (state: RootState) => state.dbConfig;

export const selectFeatureName = createSelector(
  selectDbConfigFeature,
  (state) => state.featureName,
);

export const selectVersionList = createSelector(
  selectDbConfigFeature,
  (state) => state.versions,
);

export const selectTokensDataResponse = createSelector(
  selectDbConfigFeature,
  (state) => state.tokens.response,
);

export const selectPoolsDataResponse = createSelector(
  selectDbConfigFeature,
  (state) => state.pools.response,
);

export const selectDexesDataResponse = createSelector(
  selectDbConfigFeature,
  (state) => state.dexes.response,
);

export const selectChainsDataResponse = createSelector(
  selectDbConfigFeature,
  (state) => state.chains.response,
);

export const selectJobsDataResponse = createSelector(
  selectDbConfigFeature,
  (state) => state.jobs.response,
);

export const selectBotsDataResponse = createSelector(
  selectDbConfigFeature,
  (state) => state.bots.response,
);

export const selectServersDataResponse = createSelector(
  selectDbConfigFeature,
  (state) => state.servers.response,
);

export const selectRpcUrlDataResponse = createSelector(
  selectDbConfigFeature,
  (state) => state.rpcUrls.response,
);

export const selectSwapRateDataResponse = createSelector(
  selectDbConfigFeature,
  (state) => state.swapRate.response,
);

export const selectCexChainsDataResponse = createSelector(
  selectDbConfigFeature,
  (state) => state.cexChains.response,
);

export const selectCexPairsDataResponse = createSelector(
  selectDbConfigFeature,
  (state) => state.cexPairs.response,
);

export const selectCexJobsDataResponse = createSelector(
  selectDbConfigFeature,
  (state) => state.cexJobs.response,
);

export const selectTokensMeta = createSelector(
  selectDbConfigFeature,
  (state) => state.tokens,
);

export const selectPoolsMeta = createSelector(
  selectDbConfigFeature,
  (state) => state.pools,
);

export const selectDexesMeta = createSelector(
  selectDbConfigFeature,
  (state) => state.dexes,
);

export const selectChainsMeta = createSelector(
  selectDbConfigFeature,
  (state) => state.chains,
);

export const selectCexChainsMeta = createSelector(
  selectDbConfigFeature,
  (state) => state.cexChains,
);

export const selectJobsMeta = createSelector(
  selectDbConfigFeature,
  (state) => state.jobs,
);

export const selectBotsMeta = createSelector(
  selectDbConfigFeature,
  (state) => state.bots,
);

export const selectServersMeta = createSelector(
  selectDbConfigFeature,
  (state) => state.servers,
);

export const selectRpcUrlsMeta = createSelector(
  selectDbConfigFeature,
  (state) => state.rpcUrls,
);

export const selectCexPairsMeta = createSelector(
  selectDbConfigFeature,
  (state) => state.cexPairs,
);

export const selectCexJobsMeta = createSelector(
  selectDbConfigFeature,
  (state) => state.cexJobs,
);

const selectTokenMap = createSelector(selectTokensDataResponse, (tokens) => {
  return new Map(tokens.map((token: any) => [token.tokenId, token]));
});

const selectPoolMap = createSelector(selectPoolsDataResponse, (pools) => {
  return new Map(pools.map((pool: any) => [pool.poolId, pool]));
});

const selectChainMap = createSelector(selectChainsDataResponse, (chains) => {
  return new Map(chains.map((chain: any) => [chain.chainId, chain.name]));
});

const selectDexMap = createSelector(selectDexesDataResponse, (dexes) => {
  return new Map(dexes.map((dex: any) => [dex.dexId, dex.name]));
});

export const selectTokensFullDataResponse = createSelector(
  selectTokensDataResponse,
  selectChainMap,
  (tokens, chains) => {
    return tokens.map((token: any) => ({
      ...token,
      chainName: chains.get(token.chainId) ?? token.chainName,
    }));
  },
);

export const selectFullPoolsData = createSelector(
  selectPoolsDataResponse,
  selectTokenMap,
  selectDexMap,
  selectChainMap,
  (poolsData, tokenMap, dexMap, chainMap) => {
    return poolsData.map((pool: any) => {
      const t0 = tokenMap.get(pool.token0Id);
      const t1 = tokenMap.get(pool.token1Id);

      return {
        ...pool,
        chainName: chainMap.get(pool.chainId),
        dexName: dexMap.get(pool.dexId),
        token0Name: t0?.tokenName,
        token0Symbol: t0?.symbol,
        token0Address: t0?.address,
        token1Name: t1?.tokenName,
        token1Symbol: t1?.symbol,
        token1Address: t1?.address,
      };
    });
  },
);


