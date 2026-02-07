import {createFeatureSelector, createSelector} from '@ngrx/store';
import {DB_CONFIG_FEATURE_KEY, DbConfigState} from './db-config.reducer';
import { IRpcUrl, ITokens } from '../../models/db-config';

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
export const getTokensDataResponseFilterChainId = (chainId: number) => createSelector(
  selectFeature,
  (state: DbConfigState) => state?.tokens?.response?.filter((token: ITokens) => token.chainId === chainId) ?? []
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


export const getBotsByServerIdResponse = createSelector(
  selectFeature,
  (state: DbConfigState) => state.botsByServerId.response
);
export const getBotsByServerIdIsLoading = createSelector(
  selectFeature,
  (state: DbConfigState) => state.botsByServerId.isLoading
);
export const getBotsByServerIdIsLoaded = createSelector(
  selectFeature,
  (state: DbConfigState) => state.botsByServerId.isLoaded
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

//====================================================================================================================
//                                                   Rpc Urls
//====================================================================================================================

export const getRpcUrlDataResponse = createSelector(
  selectFeature,
  (state: DbConfigState) => state.rpcUrls.response
);
export const getRpcUrlDataResponseFilterChainId = (chainId: number) => createSelector(
  selectFeature,
  (state: DbConfigState) => state?.rpcUrls?.response
      ?.filter((rpcUrl: IRpcUrl) => rpcUrl.chain?.chainId === chainId)
    ?? []
);
export const getRpcUrlsDataFailure = createSelector(
  selectFeature,
  (state: DbConfigState) => state.rpcUrls.error
);
export const getRpcUrlsDataIsFailure = createSelector(
  selectFeature,
  (state: DbConfigState) => !!state.rpcUrls.error
);
export const getRpcUrlsDataIsLoading = createSelector(
  selectFeature,
  (state: DbConfigState) => state.rpcUrls.isLoading
);
export const getRpcUrlsDataIsLoaded = createSelector(
  selectFeature,
  (state: DbConfigState) => state.rpcUrls.isLoaded
);

//====================================================================================================================
//                                                   Pools_full_data
//====================================================================================================================

export const getFullPoolsData = createSelector(
  getPoolsDataResponse,
  getTokensDataResponse,
  getDexesDataResponse,
  getChainsDataResponse,
  (poolsData, tokensData, dexesData, chainsData) => {

    const tokenMap = Object.fromEntries(tokensData.map(t => [t.tokenId, t.tokenName]));
    const dexMap = Object.fromEntries(dexesData.map(d => [d.dexId, d.name]));
    const chainMap = Object.fromEntries(chainsData.map(c => [c.chainId, c.name]));

    return poolsData.map(pool => ({
      ...pool,
      chainName: chainMap[pool.chainId],
      dexName: dexMap[pool.dexId],
      token0Name: tokenMap[pool.token0Id!],
      token1Name: tokenMap[pool.token1Id!],
    }));
  }
);

export const getFullPoolsDataIsLoading = createSelector(
  getPoolsDataIsLoading,
  getTokensDataIsLoading,
  getDexesDataIsLoading,
  getChainsDataIsLoading,
  (pools, tokens, dexes, chains) =>
    pools || tokens || dexes || chains
);
export const getFullPoolsDataIsLoaded = createSelector(
  getPoolsDataIsLoaded,
  getTokensDataIsLoaded,
  getDexesDataIsLoaded,
  getChainsDataIsLoaded,
  (pools, tokens, dexes, chains) =>
    pools && tokens && dexes && chains
);
export const getFullPoolsDataIsReady = createSelector(
  getFullPoolsDataIsLoaded,
  getFullPoolsDataIsLoading,
  (loaded, loading) => loaded && !loading
);

//====================================================================================================================
//                                                   Pairs_full_data
//====================================================================================================================
const getTokenMap = createSelector(
  getTokensDataResponse,
  (tokens) => new Map(tokens.map(t => [t.tokenId, t]))
);
const getPoolInfoMap = createSelector(
  getPoolsDataResponse,
  (pools) => new Map(pools.map(p => [p.poolId, p]))
);
const getChainMap = createSelector(
  getChainsDataResponse,
  (chains) => new Map(chains.map(c => [c.chainId, c.name]))
);
const getDexMap = createSelector(
  getDexesDataResponse,
  (dexes) => new Map(dexes.map(d => [d.dexId, d.name]))
);

export const getPairsFullData = createSelector(
  getPairsDataResponse,
  getPoolInfoMap,
  getTokenMap,
  getChainMap,
  getDexMap,
  (pairsData, poolInfoMap, tokenMap, chainMap, dexMap) => {
    return pairsData.map(pair => {
      const fullPoolData = poolInfoMap.get(pair.pool.poolId);
      const fullTokenIn = tokenMap.get(pair.tokenIn.tokenId);
      const fullTokenOut = tokenMap.get(pair.tokenOut.tokenId);

      return {
        ...pair,
        pool: {
          ...pair.pool,
          chainName: chainMap.get(fullPoolData?.chainId!),
          dexName: dexMap.get(fullPoolData?.dexId!),
          token0Name: fullTokenIn?.tokenName,
          token0Address: fullTokenIn?.address,
          token1Name: fullTokenOut?.tokenName,
          token1Address: fullTokenOut?.address,
        }
      };
    });
  }
);

export const getTokensFullDataResponse = createSelector(
  getChainMap,
  getTokensDataResponse,
  (chains, tokens): ITokens[] => {
    return tokens.map(token => {
      const fullChainData = token.chainId ? chains.get(token.chainId) : null;

      return {
        ...token,
        chainName: fullChainData || token.chainName,
      };
    });
  }
);

export const getFullTokensDataIsLoading = createSelector(
  getTokensDataIsLoading,
  getChainsDataIsLoading,
  ( tokens, chains) =>
    tokens || chains
);
export const getFullTokensDataIsLoaded = createSelector(
  getTokensDataIsLoaded,
  getChainsDataIsLoaded,
  (tokens,  chains) =>
    tokens && chains
);
export const getFullTokensDataIsReady = createSelector(
  getFullTokensDataIsLoaded,
  getFullTokensDataIsLoading,
  (loaded, loading) => loaded && !loading
);

export const getFullPairsDataIsLoading = createSelector(
  getPoolsDataIsLoading,
  getTokensDataIsLoading,
  getPairsDataIsLoading,
  getDexesDataIsLoading,
  getChainsDataIsLoading,
  (pools, tokens, pairs, dexes, chains) =>
    pools || tokens || pairs || dexes || chains
);
export const getFullPairsDataIsLoaded = createSelector(
  getPoolsDataIsLoaded,
  getTokensDataIsLoaded,
  getPairsDataIsLoaded,
  getDexesDataIsLoaded,
  getChainsDataIsLoaded,
  (pools, tokens, pairs, dexes, chains) =>
    pools && tokens && pairs && dexes && chains
);
export const getFullPairsDataIsReady = createSelector(
  getFullPairsDataIsLoaded,
  getFullPairsDataIsLoading,
  (loaded, loading) => loaded && !loading
);

export const getQuotePageDataIsReady = createSelector(
  getQuotesDataIsLoaded,
  getQuotesDataIsLoading,
  getFullPairsDataIsReady,
  (loaded, loading, pairs) => loaded && !loading && pairs
);
