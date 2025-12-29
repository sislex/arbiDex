import {createFeatureSelector, createSelector} from '@ngrx/store';
import { RELATIONS_FEATURE_KEY, RelationsState } from './relations.reducer';
import { getPairsDataResponse } from '../db-config/db-config.selectors';

export const selectFeature = createFeatureSelector<RelationsState>(RELATIONS_FEATURE_KEY);

export const getQuoteRelations = createSelector(
  selectFeature,
  (state: RelationsState) => state.quoteRelations
);
export const getQuoteRelationsIsLoading = createSelector(
  selectFeature,
  (state: RelationsState) => state.quoteRelations.isLoading
);
export const getQuoteRelationsIsLoaded = createSelector(
  selectFeature,
  (state: RelationsState) => state.quoteRelations.isLoaded
);

export const getPairsWithRelations = createSelector(
  getQuoteRelations,
  getPairsDataResponse,
  (quoteRelations, pairsList) => {
    const activeIds = new Set(
      quoteRelations?.response.map(relation => relation.pair?.pairId) || []
    );

    return pairsList.map(pair => ({
      ...pair,
      active: activeIds.has(pair.pairId)
    }));
  }
);

