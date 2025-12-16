import { createAction, props } from '@ngrx/store';

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
  props<{ data: { tokenId: number, chainId: number, address: string, symbol: string, decimals: number, tokenName: string } }>()
);
export const editToken = createAction(
  '[DbConfig] editToken',
  props<{ data: { tokenId: number, chainId: number, address: string, symbol: string, decimals: number, tokenName: string } }>()
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
