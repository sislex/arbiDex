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

export const selectPairsDataResponse = createSelector(
  selectDbConfigFeature,
  (state) => state.pairs.response,
);

export const selectQuotesDataResponse = createSelector(
  selectDbConfigFeature,
  (state) => state.quotes.response,
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

export const selectPairsFullData = createSelector(
  selectPairsDataResponse,
  selectPoolMap,
  selectTokenMap,
  selectChainMap,
  selectDexMap,
  (pairsData, poolMap, tokenMap, chainMap, dexMap) => {
    return pairsData.map((pair: any) => {
      const pool = poolMap.get(pair.poolId);
      const tokenIn = tokenMap.get(pair.tokenInId);
      const tokenOut = tokenMap.get(pair.tokenOutId);

      return {
        ...pair,
        chainName: pool?.chainId ? chainMap.get(pool.chainId) : undefined,
        dexName: pool?.dexId ? dexMap.get(pool.dexId) : undefined,
        poolAddress: pool?.poolAddress,
        tokenInName: tokenIn?.tokenName,
        tokenInSymbol: tokenIn?.symbol,
        tokenInAddress: tokenIn?.address,
        tokenOutName: tokenOut?.tokenName,
        tokenOutSymbol: tokenOut?.symbol,
        tokenOutAddress: tokenOut?.address,
      };
    });
  },
);

export const selectPairsRatingId = createSelector(
  selectDbConfigFeature,
  (state) => state.pairIdForRating,
);

export const selectTokenInList = createSelector(selectPairsFullData, (pairsData) => {
  const uniqueMap = new Map<number, { tokenInId: number; tokenInSymbol: string; tokenInAddress: string }>();

  pairsData.forEach((pair: any) => {
    if (pair.tokenInId && !uniqueMap.has(pair.tokenInId)) {
      uniqueMap.set(pair.tokenInId, {
        tokenInId: pair.tokenInId,
        tokenInSymbol: pair.tokenInSymbol ?? "Unknown",
        tokenInAddress: pair.tokenInAddress ?? "",
      });
    }
  });

  return Array.from(uniqueMap.values());
});

export const selectPairsBySelectedTokenIn = createSelector(
  selectPairsFullData,
  selectPairsRatingId,
  (allPairs, selectedId) => {
    if (!selectedId || !allPairs.length) {
      return [];
    }

    return allPairs.filter((pair: any) => pair.tokenInId === selectedId);
  },
);

export const selectPairsRating = createSelector(selectPairsBySelectedTokenIn, (filteredPairs) => {
  if (!filteredPairs.length) {
    return [];
  }

  const ratingMap = new Map<number, { data: any; count: number }>();

  filteredPairs.forEach((pair: any) => {
    const outId = pair.tokenOutId;
    const entry = ratingMap.get(outId);
    if (entry) {
      entry.count += 1;
    } else {
      ratingMap.set(outId, { data: pair, count: 1 });
    }
  });

  return Array.from(ratingMap.values())
    .map(({ data, count }) => ({
      tokenInId: data.tokenInId,
      tokenInSymbol: data.tokenInSymbol,
      tokenInAddress: data.tokenInAddress,
      tokenOutId: data.tokenOutId,
      tokenOutSymbol: data.tokenOutSymbol,
      tokenOutAddress: data.tokenOutAddress,
      count,
    }))
    .sort((a, b) => b.count - a.count);
});


