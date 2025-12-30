import { createAction, props } from '@ngrx/store';
import { IJobRelationCreate, IQuoteRelationsCreate } from '../../models/relations';

//====================================================================================================================
//                                                   Quote Relations
//====================================================================================================================

export const setQuoteRelationsDataList = createAction(
  '[Relations] setQuoteRelationsDataList',
  props<{ quoteId: number }>()
);
export const setQuoteRelationsDataListSuccess = createAction(
  '[Relations] setQuoteRelationsDataListSuccess',
  props<{ response: any }>()
);
export const setQuoteRelationsDataListFailure = createAction(
  '[DbConfig] setQuoteRelationsDataListFailure',
  props<{ error: string }>()
);
export const createQuoteRelations = createAction(
  '[DbConfig] createQuoteRelations',
  props<{ data: IQuoteRelationsCreate[] }>()
);
export const deletingQuoteRelations = createAction(
  '[DbConfig] deletingQuoteRelations',
  props<{ quoteRelationsIds: number[] }>()
);
export const setQuoteRelations = createAction('[DbConfig] setQuoteRelations');
export const setQuoteRelationsSuccess = createAction(
  '[Relations] setQuoteRelationsSuccess',
  props<{ response: any }>()
);
export const setQuoteRelationsFailure = createAction(
  '[DbConfig] setQuoteRelationsFailure',
  props<{ error: string }>()
);

//====================================================================================================================
//                                                   Job Relations
//====================================================================================================================

export const setJobRelationsDataList = createAction(
  '[Relations] setJobRelationsDataList',
  props<{ jobId: number }>()
);
export const setJobRelationsDataListSuccess = createAction(
  '[Relations] setJobRelationsDataListSuccess',
  props<{ response: any }>()
);
export const setJobRelationsDataListFailure = createAction(
  '[DbConfig] setJobRelationsDataListFailure',
  props<{ error: string }>()
);
export const createJobRelations = createAction(
  '[DbConfig] createJobRelations',
  props<{ data: IJobRelationCreate[] }>()
);
export const deletingJobRelations = createAction(
  '[DbConfig] deletingJobRelations',
  props<{ jobRelationsIds: number[] }>()
);
