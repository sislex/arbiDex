import {createReducer, on} from '@ngrx/store';
import * as ViewActions from './view.actions';

export const VIEW_FEATURE_KEY = 'view';

export interface ViewState {
  isSidebarOpen: boolean;
  sidebarList: string[];
  activeSidebarItem: string;
}

export interface ViewPartialState {
  readonly [VIEW_FEATURE_KEY]: ViewState;
}

export const initialState: ViewState = {
  isSidebarOpen: true,
  sidebarList: [
    'Tokens',
    'Pools',
    'Dexes',
    'Chains',
    'Pairs',
    'Quotes',
    'Jobs',
    'Bots',
    'Servers',
  ],
  activeSidebarItem: '',
};

export const viewReducer = createReducer(
  initialState,
  on(ViewActions.toggleSidebar, (state) => ({
    ...state,
    isSidebarOpen: !state.isSidebarOpen
  })),
  on(ViewActions.setActiveSidebarItem, (state, {item}) => ({
    ...state,
    activeSidebarItem: item
  })),
);
