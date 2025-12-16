import { Routes } from '@angular/router';
import {Main} from './containers/main/main';
import {AgGridChainsContainer} from './containers/ag-grid/ag-grid-chains-container/ag-grid-chains-container';
import {AgGridTokensContainer} from './containers/ag-grid/ag-grid-tokens-container/ag-grid-tokens-container';
import {AgGridPoolsContainer} from './containers/ag-grid/ag-grid-pools-container/ag-grid-pools-container';
import {AgGridMarketsContainer} from './containers/ag-grid/ag-grid-markets-container/ag-grid-markets-container';
import {AgGridDexesContainer} from './containers/ag-grid/ag-grid-dexes-container/ag-grid-dexes-container';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'data-view/tokens'
  },
  {
    path: 'data-view',
    component: Main,
    children: [
      {
        path: 'chains',
        component: AgGridChainsContainer
      },
      {
        path: 'dexes',
        component: AgGridDexesContainer
      },
      {
        path: 'markets',
        component: AgGridMarketsContainer
      },
      {
        path: 'pools',
        component: AgGridPoolsContainer
      },
      {
        path: 'tokens',
        component: AgGridTokensContainer
      },
    ]
  }
];
