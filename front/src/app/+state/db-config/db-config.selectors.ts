import {createFeatureSelector, createSelector} from '@ngrx/store';
import {DB_CONFIG_FEATURE_KEY, DbConfigState} from './db-config.reducer';
import {IQuotes, IRpcUrl, ITokens} from '../../models/db-config';

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
const getRpcUrlsMap = createSelector(
  getRpcUrlDataResponse,
  (rpcUrls) => new Map(rpcUrls.map(r => [r.rpcUrlId, r.rpcUrl]))
);
const getJobsMap = createSelector(
  getJobsDataResponse,
  (jobs) => new Map(jobs.map(j => [j.jobId, j.jobType]))
);
const getServersMap = createSelector(
  getServersDataResponse,
  (servers) => new Map(servers.map(s => [s.serverId, s.serverName]))
);

export const getPairsFullData = createSelector(
  getPairsDataResponse,
  getPoolInfoMap,
  getTokenMap,
  getChainMap,
  getDexMap,
  (pairsData, poolInfoMap, tokenMap, chainMap, dexMap) => {
    return pairsData.map(pair => {
      const fullPoolData = poolInfoMap.get(pair.poolId);
      const fullTokenIn = tokenMap.get(pair.tokenInId);
      const fullTokenOut = tokenMap.get(pair.tokenOutId);

      return {
        ...pair,
        chainName: chainMap.get(fullPoolData?.chainId!),
        dexName: dexMap.get(fullPoolData?.dexId!),
        poolAddress: fullPoolData?.poolAddress,
        tokenInName: fullTokenIn?.tokenName,
        tokenInAddress: fullTokenIn?.address,
        tokenOutName: fullTokenOut?.tokenName,
        tokenOutAddress: fullTokenOut?.address,
        fee: fullPoolData?.fee,
        version: fullPoolData?.version,
      };
    });
  }
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

export const getQuotesFullDataResponse = createSelector(
  getQuotesDataResponse,
  getTokenMap,
  (quotes, tokens) => {
    return quotes.map(quote => {
      const fullTokenData = quote.tokenId ? tokens.get(quote.tokenId) : null;

      return {
        ...quote,
        tokenName: fullTokenData?.tokenName || quote.tokenName,
      };
    });
  }
);

export const getFullQuotesDataIsLoading = createSelector(
  getTokensDataIsLoading,
  getQuotesDataIsLoading,
  ( tokens, quotes) =>
    tokens || quotes
);
export const getFullQuotesDataIsLoaded = createSelector(
  getTokensDataIsLoaded,
  getQuotesDataIsLoaded,
  (tokens,  quotes) =>
    tokens && quotes
);
export const getFullQuotesDataIsReady = createSelector(
  getFullQuotesDataIsLoaded,
  getFullQuotesDataIsLoading,
  (loaded, loading) => loaded && !loading
);

export const getQuoteFullDataResponse = createSelector(
  getQuotesDataResponse,
  getTokenMap,
  (quotes: unknown, tokens) => {
    const quote = quotes as IQuotes;
    const fullTokenData = quote.tokenId ? tokens.get(quote.tokenId) : null;
    return {
      ...quote,
      tokenName: fullTokenData?.tokenName || quote.tokenName,
    };
  }
);

export const getJobsFullDataResponse = createSelector(
  getJobsDataResponse,
  getChainMap,
  getRpcUrlsMap,
  (jobs, chains, rpcUrls) => {
    return jobs.map(job => {
      const fullChainsData = job.chainId ? chains.get(job.chainId) : null;
      const fullRpcUrlsData = job.rpcUrlId ? rpcUrls.get(job.rpcUrlId) : null;
      return {
        ...job,
        chainName: fullChainsData,
        rpcUrl: fullRpcUrlsData,
      };
    });
  }
);

export const getFullJobsDataIsLoading = createSelector(
  getJobsDataIsLoading,
  getChainsDataIsLoading,
  getRpcUrlsDataIsLoading,
  (jobs, chains, rpcUrls) =>
    jobs || chains || rpcUrls
);
export const getFullJobsDataIsLoaded = createSelector(
  getJobsDataIsLoaded,
  getChainsDataIsLoaded,
  getRpcUrlsDataIsLoaded,
  (jobs, chains, rpcUrls) =>
    jobs && chains && rpcUrls
);
export const getFullJobsDataIsReady = createSelector(
  getFullJobsDataIsLoaded,
  getFullJobsDataIsLoading,
  (loaded, loading) => loaded && !loading
);

export const getFullBotsDataResponse = createSelector(
  getBotsDataResponse,
  getJobsMap,
  getServersMap,
  (bots, jobs, servers) => {
    return bots.map(bot => {
      const fullJobsData = bot.jobId ? jobs.get(bot.jobId) : null;
      const fullServersData = bot.serverId ? servers.get(bot.serverId) : null;
      return {
        ...bot,
        jobType: fullJobsData,
        serverName: fullServersData,
      };
    });
  }
);

export const getFullBotsDataIsLoading = createSelector(
  getBotsDataIsLoading,
  getJobsDataIsLoading,
  getServersDataIsLoading,
  (bots, jobs, servers) =>
    bots || jobs || servers
);

export const getFullBotsDataIsLoaded = createSelector(
  getBotsDataIsLoaded,
  getJobsDataIsLoaded,
  getServersDataIsLoaded,
  (bots, jobs, servers) =>
    bots && jobs && servers
);
export const getFullBotsDataIsReady = createSelector(
  getFullBotsDataIsLoaded,
  getFullBotsDataIsLoading,
  (loaded, loading) => loaded && !loading
);
