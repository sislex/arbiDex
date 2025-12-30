import {createFeatureSelector, createSelector} from '@ngrx/store';
import { RELATIONS_FEATURE_KEY, RelationsState } from './relations.reducer';
import { getPairsDataResponse } from '../db-config/db-config.selectors';

export const selectFeature = createFeatureSelector<RelationsState>(RELATIONS_FEATURE_KEY);

//====================================================================================================================
//                                                   Quote Relations
//====================================================================================================================

export const getQuoteRelations = createSelector(
  selectFeature,
  (state: RelationsState) => state.quoteRelationsByQuoteId.response
);
export const getQuoteRelationsIsLoading = createSelector(
  selectFeature,
  (state: RelationsState) => state.quoteRelationsByQuoteId.isLoading
);
export const getQuoteRelationsIsLoaded = createSelector(
  selectFeature,
  (state: RelationsState) => state.quoteRelationsByQuoteId.isLoaded
);

export const getPairsWithRelations = createSelector(
  getQuoteRelations,
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

// export const getPairsWithRelations = createSelector(
//   getJobRelations,
//   getPairsDataResponse,
//   (jobRelations, pairsList) => {
//     const activeIds = new Set(
//       jobRelations?.map(relation => relation.pair?.pairId) || []
//     );
//
//     return pairsList.map(pair => ({
//       ...pair,
//       active: activeIds.has(pair.pairId)
//     }));
//   }
// );

