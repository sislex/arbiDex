import {createFeatureSelector, createSelector} from '@ngrx/store';
import { RELATIONS_FEATURE_KEY, RelationsState } from './relations.reducer';

export const selectFeature = createFeatureSelector<RelationsState>(RELATIONS_FEATURE_KEY);

