import {createReducer, on} from '@ngrx/store';
import { IArbitrumMultiQuoteJob } from '../../models/main';

export const MAIN_FEATURE_KEY = 'main';

export interface MainState {
  jobConfig: IArbitrumMultiQuoteJob,
}

export interface MainPartialState {
  readonly [MAIN_FEATURE_KEY]: MainState;
}

export const initialState: MainState = {
  jobConfig: {
    jobType: '',
    rpcUrl: 'https://arb1.arbitrum.io/rpc',
    pairsToQuote: [],
  },
}

export const mainReducer = createReducer(
  initialState,
)
