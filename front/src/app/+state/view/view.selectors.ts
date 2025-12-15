import {createFeatureSelector, createSelector} from '@ngrx/store';
import {VIEW_FEATURE_KEY, ViewState} from './view.reducer';

export const selectFeature = createFeatureSelector<ViewState>(VIEW_FEATURE_KEY);

export const getIsSidebarOpen = createSelector(
  selectFeature,
  (state: ViewState) => state.isSidebarOpen
);
