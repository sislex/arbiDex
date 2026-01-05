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
  '[Relations] setQuoteRelationsDataListFailure',
  props<{ error: string }>()
);
export const createQuoteRelations = createAction(
  '[Relations] createQuoteRelations',
  props<{ quoteId: number, data: IQuoteRelationsCreate[] }>()
);
export const deletingQuoteRelations = createAction(
  '[Relations] deletingQuoteRelations',
  props<{ quoteId: number, quoteRelationsIds: number[] }>()
);
export const setQuoteRelations = createAction('[Relations] setQuoteRelations');
export const setQuoteRelationsSuccess = createAction(
  '[Relations] setQuoteRelationsSuccess',
  props<{ response: any }>()
);
export const setQuoteRelationsFailure = createAction(
  '[Relations] setQuoteRelationsFailure',
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
  '[Relations] setJobRelationsDataListFailure',
  props<{ error: string }>()
);
export const createJobRelations = createAction(
  '[Relations] createJobRelations',
  props<{ jobId: number, data: IJobRelationCreate[] }>()
);
export const deletingJobRelations = createAction(
  '[Relations] deletingJobRelations',
  props<{ jobId: number, jobRelationsIds: number[] }>()
);
