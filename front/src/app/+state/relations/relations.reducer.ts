import {createReducer, on} from '@ngrx/store';
import {emptyAsyncResponse} from '../db-config/configs';
import {
  IJobRelationsAPI, IQuoteRelationsAPI,
} from '../../models/relations';

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
)
