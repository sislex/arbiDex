import { createAction, props } from '@ngrx/store';
import { IChainsCreate, IDexesCreate, IMarketsCreate, IPoolsCreate, ITokensCreate } from '../../models/db-config';

export const setServerList = createAction('[DbConfig] setServerList');

//====================================================================================================================
//                                                   Tokens
//====================================================================================================================

export const setTokensData = createAction('[DbConfig] setTokensData');
export const setTokensDataSuccess = createAction(
  '[DbConfig] setTokensDataSuccess',
  props<{ response: any }>()
);
export const setTokensDataFailure = createAction(
  '[DbConfig] setTokensDataFailure',
  props<{ error: string }>()
);
export const createToken = createAction(
  '[DbConfig] createToken',
  props<{ data: ITokensCreate }>()
);
export const editToken = createAction(
  '[DbConfig] editToken',
  props<{ data: ITokensCreate }>()
);
export const deletingToken = createAction(
  '[DbConfig] deletingToken',
  props<{ tokenId: number }>()
);

//====================================================================================================================
//                                                   Pools
//====================================================================================================================

export const setPoolsData = createAction('[DbConfig] setPoolsData');
export const setPoolsDataSuccess = createAction(
  '[DbConfig] setPoolsDataSuccess',
  props<{ response: any }>()
);
export const setPoolsDataFailure = createAction(
  '[DbConfig] setPoolsDataFailure',
  props<{ error: string }>()
);
export const createPools = createAction(
  '[DbConfig] createPools',
  props<{ data: IPoolsCreate }>()
);
export const editPools = createAction(
  '[DbConfig] editPools',
  props<{ data: IPoolsCreate }>()
);
export const deletingPools = createAction(
  '[DbConfig] deletingPools',
  props<{ tokenId: number }>()
);

//====================================================================================================================
//                                                   Markets
//====================================================================================================================

export const setMarketsData = createAction('[DbConfig] setMarketsData');
export const setMarketsDataSuccess = createAction(
  '[DbConfig] setMarketsDataSuccess',
  props<{ response: any }>()
);
export const setMarketsDataFailure = createAction(
  '[DbConfig] setMarketsDataFailure',
  props<{ error: string }>()
);
export const createMarkets = createAction(
  '[DbConfig] createMarkets',
  props<{ data: IMarketsCreate }>()
);
export const editMarkets = createAction(
  '[DbConfig] editMarkets',
  props<{ data: IMarketsCreate }>()
);
export const deletingMarkets = createAction(
  '[DbConfig] deletingMarkets',
  props<{ tokenId: number }>()
);

//====================================================================================================================
//                                                   Dexes
//====================================================================================================================

export const setDexesData = createAction('[DbConfig] setDexesData');
export const setDexesDataSuccess = createAction(
  '[DbConfig] setDexesDataSuccess',
  props<{ response: any }>()
);
export const setDexesDataFailure = createAction(
  '[DbConfig] setDexesDataFailure',
  props<{ error: string }>()
);
export const createDexes = createAction(
  '[DbConfig] createDexes',
  props<{ data: IDexesCreate }>()
);
export const editDexes = createAction(
  '[DbConfig] editDexes',
  props<{ data: IDexesCreate }>()
);
export const deletingDexes = createAction(
  '[DbConfig] deletingDexes',
  props<{ tokenId: number }>()
);

//====================================================================================================================
//                                                   Chains
//====================================================================================================================

export const setChainsData = createAction('[DbConfig] setChainsData');
export const setChainsDataSuccess = createAction(
  '[DbConfig] setChainsDataSuccess',
  props<{ response: any }>()
);
export const setChainsDataFailure = createAction(
  '[DbConfig] setChainsDataFailure',
  props<{ error: string }>()
);
export const createChains = createAction(
  '[DbConfig] createChains',
  props<{ data: IChainsCreate }>()
);
export const editChains = createAction(
  '[DbConfig] editChains',
  props<{ data: IChainsCreate }>()
);
export const deletingChains = createAction(
  '[DbConfig] deletingChains',
  props<{ tokenId: number }>()
);
