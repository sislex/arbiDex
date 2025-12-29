import { createAction, props } from '@ngrx/store';

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
// export const createServer = createAction(
//   '[DbConfig] createServer',
//   props<{ data: IServersCreate }>()
// );
// export const editServer = createAction(
//   '[DbConfig] editServer',
//   props<{ data: IServersCreate }>()
// );
// export const deletingServer = createAction(
//   '[DbConfig] deletingServer',
//   props<{ serverId: number }>()
// );
