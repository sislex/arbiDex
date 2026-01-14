import {createReducer, on} from '@ngrx/store';
import {emptyAsyncResponse} from '../db-config/configs';
import {
  IJobRelationsAPI, IQuoteRelationsAPI,
} from '../../models/relations';
import * as RelationsActions from './relations.actions';
import { IBotsAPI, IServersAPI } from '../../models/db-config';

export const RELATIONS_FEATURE_KEY = 'relations';

export interface RelationsState {
  quoteRelationsByQuoteId: IQuoteRelationsAPI;
  quoteRelationsList: IQuoteRelationsAPI;
  jobRelations: IJobRelationsAPI;
  activeBot: IBotsAPI;
  activeServer: IServersAPI;
}

export interface RelationsPartialState {
  readonly [RELATIONS_FEATURE_KEY]: RelationsState;
}

export const initialState: RelationsState = {
  quoteRelationsByQuoteId: emptyAsyncResponse([]),
  quoteRelationsList: emptyAsyncResponse([]),
  jobRelations: emptyAsyncResponse([]),
  activeBot: emptyAsyncResponse([]),
  activeServer: emptyAsyncResponse([]),
}

export const relationsReducer = createReducer(
  initialState,
  on(RelationsActions.setQuoteRelationsDataList, (state) => ({
    ...state,
    quoteRelationsByQuoteId: {
      ...state.quoteRelationsByQuoteId,
      startTime:  Date.now(),
      isLoading: true,
      isLoaded: false,
    }
  })),
  on(RelationsActions.setQuoteRelationsDataListSuccess, (state, {response}) => ({
    ...state,
    quoteRelationsByQuoteId: {
      ...state.quoteRelationsByQuoteId,
      loadingTime: Date.now() - state.quoteRelationsByQuoteId.startTime!,
      isLoading: false,
      isLoaded: true,
      response
    }
  })),
  on(RelationsActions.setQuoteRelationsDataListFailure, (state, {error}) => ({
    ...state,
    quoteRelationsByQuoteId: {
      ...state.quoteRelationsByQuoteId,
      loadingTime: Date.now() - state.quoteRelationsByQuoteId.startTime!,
      isLoading: false,
      isLoaded: true,
      error
    }
  })),

  on(RelationsActions.setQuoteRelations, (state) => ({
    ...state,
    quoteRelationsList: {
      ...state.quoteRelationsList,
      startTime:  Date.now(),
      isLoading: true,
      isLoaded: false,
    }
  })),
  on(RelationsActions.setQuoteRelationsSuccess, (state, {response}) => ({
    ...state,
    quoteRelationsList: {
      ...state.quoteRelationsList,
      loadingTime: Date.now() - state.quoteRelationsList.startTime!,
      isLoading: false,
      isLoaded: true,
      response
    }
  })),
  on(RelationsActions.setQuoteRelationsFailure, (state, {error}) => ({
    ...state,
    quoteRelationsList: {
      ...state.quoteRelationsList,
      loadingTime: Date.now() - state.quoteRelationsList.startTime!,
      isLoading: false,
      isLoaded: true,
      error
    }
  })),

  on(RelationsActions.setJobRelationsDataList, (state) => ({
    ...state,
    jobRelations: {
      ...state.jobRelations,
      startTime:  Date.now(),
      isLoading: true,
      isLoaded: false,
    }
  })),
  on(RelationsActions.setJobRelationsDataListSuccess, (state, {response}) => ({
    ...state,
    jobRelations: {
      ...state.jobRelations,
      loadingTime: Date.now() - state.jobRelations.startTime!,
      isLoading: false,
      isLoaded: true,
      response
    }
  })),
  on(RelationsActions.setJobRelationsDataListFailure, (state, {error}) => ({
    ...state,
    jobRelations: {
      ...state.jobRelations,
      loadingTime: Date.now() - state.jobRelations.startTime!,
      isLoading: false,
      isLoaded: true,
      error
    }
  })),

  on(RelationsActions.setActiveBot, (state) => ({
    ...state,
    activeBot: {
      ...state.activeBot,
      startTime:  Date.now(),
      isLoading: true,
      isLoaded: false,
    }
  })),
  on(RelationsActions.setActiveBotSuccess, (state, {response}) => ({
    ...state,
    activeBot: {
      ...state.activeBot,
      loadingTime: Date.now() - state.activeBot.startTime!,
      isLoading: false,
      isLoaded: true,
      response
    }
  })),
  on(RelationsActions.setActiveBotFailure, (state, {error}) => ({
    ...state,
    activeBot: {
      ...state.activeBot,
      loadingTime: Date.now() - state.activeBot.startTime!,
      isLoading: false,
      isLoaded: true,
      error
    }
  })),

  on(RelationsActions.setActiveServer, (state) => ({
    ...state,
    activeServer: {
      ...state.activeServer,
      startTime:  Date.now(),
      isLoading: true,
      isLoaded: false,
    }
  })),
  on(RelationsActions.setActiveServerSuccess, (state, {response}) => ({
    ...state,
    activeServer: {
      ...state.activeServer,
      loadingTime: Date.now() - state.activeServer.startTime!,
      isLoading: false,
      isLoaded: true,
      response
    }
  })),
  on(RelationsActions.setActiveServerFailure, (state, {error}) => ({
    ...state,
    activeServer: {
      ...state.activeServer,
      loadingTime: Date.now() - state.activeServer.startTime!,
      isLoading: false,
      isLoaded: true,
      error
    }
  })),
)
