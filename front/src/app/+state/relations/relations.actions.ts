import { createAction, props } from '@ngrx/store';
import { IQuoteRelationsCreate } from '../../models/relations';

//====================================================================================================================
//                                                   Pair Quote Relations
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
