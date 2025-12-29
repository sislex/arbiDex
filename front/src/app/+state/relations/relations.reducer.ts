import {createReducer, on} from '@ngrx/store';
import {emptyAsyncResponse} from '../db-config/configs';
import {
  IJobRelationsAPI, IQuoteRelationsAPI,
} from '../../models/relations';
import * as RelationsActions from './relations.actions';

export const RELATIONS_FEATURE_KEY = 'relations';

export interface RelationsState {
  quoteRelations: IQuoteRelationsAPI;
  jobRelations: IJobRelationsAPI;
}

export interface DbConfigPartialState {
  readonly [RELATIONS_FEATURE_KEY]: RelationsState;
}

export const initialState: RelationsState = {
  quoteRelations: emptyAsyncResponse([]),
  jobRelations: emptyAsyncResponse([]),
}

export const relationsReducer = createReducer(
  initialState,
  on(RelationsActions.setQuoteRelationsDataList, (state) => ({
    ...state,
    quoteRelations: {
      ...state.quoteRelations,
      startTime:  Date.now(),
      isLoading: true,
      isLoaded: false,
    }
  })),
  on(RelationsActions.setQuoteRelationsDataListSuccess, (state, {response}) => ({
    ...state,
    quoteRelations: {
      ...state.quoteRelations,
      loadingTime: Date.now() - state.quoteRelations.startTime!,
      isLoading: false,
      isLoaded: true,
      response
    }
  })),
  on(RelationsActions.setQuoteRelationsDataListFailure, (state, {error}) => ({
    ...state,
    quoteRelations: {
      ...state.quoteRelations,
      loadingTime: Date.now() - state.quoteRelations.startTime!,
      isLoading: false,
      isLoaded: true,
      error
    }
  })),
)
