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
import { BotPageContainer } from './containers/pages/bot-page-container/bot-page-container';
import { AgGridRpcUrlsContainer } from './containers/ag-grid/ag-grid-rpc-urls-container/ag-grid-rpc-urls-container';
import { ServerPageContainer } from './containers/pages/server-page-container/server-page-container';
import {ImportsPage} from './containers/pages/imports-page/imports-page';
import {AgGridCexJobsContainer} from './containers/ag-grid/ag-grid-cex-jobs-container/ag-grid-cex-jobs-container';
import {AgGridCexPoolsContainer} from './containers/ag-grid/ag-grid-cex-pools-container/ag-grid-cex-pools-container';
import {AgGridCexChainsContainer} from './containers/ag-grid/ag-grid-cex-chains-container/ag-grid-cex-chains-container';

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
        path: 'rpc-urls',
        component: AgGridRpcUrlsContainer,
        data: { feature: 'rpc-urls' },
      },
      {
        path: 'dex-jobs',
        component: AgGridJobsContainer,
        data: { feature: 'dex-jobs' },
      },
      {
        path: 'cex-jobs',
        component: AgGridCexJobsContainer,
        data: { feature: 'cex-jobs' },
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
        path: 'dex-chains',
        component: AgGridChainsContainer,
        data: { feature: 'dex-chains' },
      },
      {
        path: 'cex-chains',
        component: AgGridCexChainsContainer,
        data: { feature: 'cex-chains' },
      },
      {
        path: 'dexes',
        component: AgGridDexesContainer,
        data: { feature: 'dexes' },
      },
      {
        path: 'dex-pools',
        component: AgGridPoolsContainer,
        data: { feature: 'dex-pools' },
      },
      {
        path: 'cex-pools',
        component: AgGridCexPoolsContainer,
        data: { feature: 'cex-pools' },
      },
      {
        path: 'tokens',
        component: AgGridTokensContainer,
        data: { feature: 'tokens' },
      },
      {
        path: 'imports',
        component: ImportsPage,
        data: { feature: 'imports' },
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
  {
    path: 'data-view/bots/:id',
    component: BotPageContainer,
    data: { feature: 'bot relations' },
  },
  {
    path: 'data-view/servers/:id',
    component: ServerPageContainer,
    data: { feature: 'servers relations' },
  },
];
