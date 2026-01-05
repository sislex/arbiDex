import { Routes } from '@angular/router';
import {Main} from './containers/main/main';
import {AgGridChainsContainer} from './containers/ag-grid/ag-grid-chains-container/ag-grid-chains-container';
import {AgGridTokensContainer} from './containers/ag-grid/ag-grid-tokens-container/ag-grid-tokens-container';
import {AgGridPoolsContainer} from './containers/ag-grid/ag-grid-pools-container/ag-grid-pools-container';
import {AgGridDexesContainer} from './containers/ag-grid/ag-grid-dexes-container/ag-grid-dexes-container';
import { AgGridPairsContainer } from './containers/ag-grid/ag-grid-pairs-container/ag-grid-pairs-container';
import { AgGridJobsContainer } from './containers/ag-grid/ag-grid-jobs-container/ag-grid-jobs-container';
import { AgGridQuotesContainer } from './containers/ag-grid/ag-grid-quotes-container/ag-grid-quotes-container';
import { AgGridBotsContainer } from './containers/ag-grid/ag-grid-bots-container/ag-grid-bots-container';
import { AgGridServersContainer } from './containers/ag-grid/ag-grid-servers-container/ag-grid-servers-container';
import { QuotePageContainer } from './containers/pages/quote-page-container/quote-page-container';
import { JobPageContainer } from './containers/pages/job-page-container/job-page-container';

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
        path: 'servers',
        component: AgGridServersContainer,
        data: { feature: 'servers' },
      },
      {
        path: 'bots',
        component: AgGridBotsContainer,
        data: { feature: 'bots' },
      },
      {
        path: 'jobs',
        component: AgGridJobsContainer,
        data: { feature: 'jobs' },
      },
      {
        path: 'quotes',
        component: AgGridQuotesContainer,
        data: { feature: 'quotes' },
      },
      {
        path: 'pairs',
        component: AgGridPairsContainer,
        data: { feature: 'pairs' },
      },
      {
        path: 'chains',
        component: AgGridChainsContainer,
        data: { feature: 'chains' },
      },
      {
        path: 'dexes',
        component: AgGridDexesContainer,
        data: { feature: 'dexes' },
      },
      {
        path: 'pools',
        component: AgGridPoolsContainer,
        data: { feature: 'pools' },
      },
      {
        path: 'tokens',
        component: AgGridTokensContainer,
        data: { feature: 'tokens' },
      },
    ]
  },
  {
    path: 'data-view/quotes/:id',
    component: QuotePageContainer,
    data: { feature: 'quote relations' },
  },
  {
    path: 'data-view/jobs/:id',
    component: JobPageContainer,
    data: { feature: 'job relations' },
  },
];
