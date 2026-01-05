import {createFeatureSelector, createSelector} from '@ngrx/store';
import { MAIN_FEATURE_KEY, MainState } from './main.reducer';

export const selectFeature = createFeatureSelector<MainState>(MAIN_FEATURE_KEY);


