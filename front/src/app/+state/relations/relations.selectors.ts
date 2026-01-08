import {createFeatureSelector, createSelector} from '@ngrx/store';
import { RELATIONS_FEATURE_KEY, RelationsState } from './relations.reducer';
import { getBotsDataResponse, getJobsDataResponse, getPairsDataResponse } from '../db-config/db-config.selectors';

export const selectFeature = createFeatureSelector<RelationsState>(RELATIONS_FEATURE_KEY);

//====================================================================================================================
//                                                   Quote Relations
//====================================================================================================================

export const getQuoteRelationsByQuoteId = createSelector(
  selectFeature,
  (state: RelationsState) => state.quoteRelationsByQuoteId.response
);
export const getQuoteRelationsByQuoteIdIsLoading = createSelector(
  selectFeature,
  (state: RelationsState) => state.quoteRelationsByQuoteId.isLoading
);
export const getQuoteRelationsByQuoteIdIsLoaded = createSelector(
  selectFeature,
  (state: RelationsState) => state.quoteRelationsByQuoteId.isLoaded
);
export const getQuoteRelations = createSelector(
  selectFeature,
  (state: RelationsState) => state.quoteRelationsList.response
);
export const getQuoteRelationsIsLoading = createSelector(
  selectFeature,
  (state: RelationsState) => state.quoteRelationsList.isLoading
);
export const getQuoteRelationsIsLoaded = createSelector(
  selectFeature,
  (state: RelationsState) => state.quoteRelationsList.isLoaded
);

export const getPairsWithRelations = createSelector(
  getQuoteRelationsByQuoteId,
  getPairsDataResponse,
  (quoteRelations, pairsList) => {
    const activeIds = new Set(
      quoteRelations?.map(relation => relation.pair?.pairId) || []
    );

    return pairsList.map(pair => ({
      ...pair,
      active: activeIds.has(pair.pairId)
    }));
  }
);

//====================================================================================================================
//                                                   Job Relations
//====================================================================================================================

export const getJobRelations = createSelector(
  selectFeature,
  (state: RelationsState) => state.jobRelations.response
);
export const getJobRelationsIsLoading = createSelector(
  selectFeature,
  (state: RelationsState) => state.jobRelations.isLoading
);
export const getJobRelationsIsLoaded = createSelector(
  selectFeature,
  (state: RelationsState) => state.jobRelations.isLoaded
);

export const getQuoteRelationsWithStatus = createSelector(
  getJobRelations,
  getQuoteRelations,
  (jobRelations, quoteRelations) => {

    const activeIds = new Set(
      jobRelations?.map(relation => relation.quote?.pairQuoteRelationId) || []
    );

    return quoteRelations.map(quote => ({
      ...quote,
      active: activeIds.has(quote.pairQuoteRelationId)
    }));
  }
);

//====================================================================================================================
//                                                   Bot Relations
//====================================================================================================================

export const getActiveBot = createSelector(
  selectFeature,
  (state: RelationsState) => state.activeBot.response
);
export const getActiveBotIsLoading = createSelector(
  selectFeature,
  (state: RelationsState) => state.activeBot.isLoading
);
export const getActiveBotIsLoaded = createSelector(
  selectFeature,
  (state: RelationsState) => state.activeBot.isLoaded
);

export const getBotRelation = createSelector(
  getJobsDataResponse,
  getActiveBot,
  (jobData, botData: any) => {
    if (!jobData?.length || !botData?.job?.jobId) {
      return null;
    }
    return jobData.map(job => ({
      ...job,
      active: job.jobId === botData.job.jobId
    }));
  }
);

//====================================================================================================================
//                                                   Server Relations
//====================================================================================================================

export const getActiveServer = createSelector(
  selectFeature,
  (state: RelationsState) => state.activeServer.response
);
export const getActiveServerIsLoading = createSelector(
  selectFeature,
  (state: RelationsState) => state.activeServer.isLoading
);
export const getActiveServerIsLoaded = createSelector(
  selectFeature,
  (state: RelationsState) => state.activeServer.isLoaded
);

export const getServerRelation = createSelector(
  getBotsDataResponse,
  getActiveServer,
  (botData, serverData: any) => {
    if (!botData?.length || !serverData?.serverId) {
      return null;
    }
    return botData.map(bot => ({
      ...bot,
      active: bot.server.serverId === serverData.serverId
    }));
  }
);
