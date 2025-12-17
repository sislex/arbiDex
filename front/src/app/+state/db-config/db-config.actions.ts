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
export const createPool = createAction(
  '[DbConfig] createPool',
  props<{ data: IPoolsCreate }>()
);
export const editPool = createAction(
  '[DbConfig] editPool',
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
export const createMarket = createAction(
  '[DbConfig] createMarket',
  props<{ data: IMarketsCreate }>()
);
export const editMarket = createAction(
  '[DbConfig] editMarket',
  props<{ data: IMarketsCreate }>()
);
export const deletingMarket = createAction(
  '[DbConfig] deletingMarket',
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
export const createDex = createAction(
  '[DbConfig] createDex',
  props<{ data: IDexesCreate }>()
);
export const editDex = createAction(
  '[DbConfig] editDex',
  props<{ data: IDexesCreate }>()
);
export const deletingDex = createAction(
  '[DbConfig] deletingDex',
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
export const createChain = createAction(
  '[DbConfig] createChain',
  props<{ data: IChainsCreate }>()
);
export const editChain = createAction(
  '[DbConfig] editChain',
  props<{ data: IChainsCreate }>()
);
export const deletingChain = createAction(
  '[DbConfig] deletingChain',
  props<{ tokenId: number }>()
);
