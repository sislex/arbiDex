import { createAction, props } from '@ngrx/store';

//====================================================================================================================
//                                                   Pair Quote Relations
//====================================================================================================================

export const setQuoteRelationsDataList = createAction(
  '[Relations] setQuoteRelationsDataList',
  props<{ pairId: number }>()
);
export const setQuoteRelationsDataListSuccess = createAction(
  '[Relations] setQuoteRelationsDataListSuccess',
  props<{ response: any }>()
);
// export const setServersDataFailure = createAction(
//   '[DbConfig] setServersDataFailure',
//   props<{ error: string }>()
// );
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
