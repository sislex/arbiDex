import { Component, EventEmitter, inject, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { DeleteDialogService } from '../../../services/delete-dialog-service';
import { ColDef } from 'ag-grid-community';
import { AgGrid } from '../../../components/ag-grid/ag-grid';
import { HeaderContentLayout } from '../../../components/layouts/header-content-layout/header-content-layout';
import { TitleTableButton } from '../../../components/title-table-button/title-table-button';
import {
  getJobRelationsIsLoaded,
  getJobRelationsIsLoading, getQuoteRelationsIsLoaded, getQuoteRelationsIsLoading, getQuoteRelationsWithStatus,
} from '../../../+state/relations/relations.selectors';
import { AsyncPipe } from '@angular/common';
import { Loader } from '../../../components/loader/loader';

@Component({
  selector: 'app-ag-grid-job-relations-container',
  imports: [
    AgGrid,
    HeaderContentLayout,
    TitleTableButton,
    AsyncPipe,
    Loader,
  ],
  templateUrl: './ag-grid-job-relations-container.html',
  styleUrl: './ag-grid-job-relations-container.scss',
})
export class AgGridJobRelationsContainer {
  @Output() emitter = new EventEmitter();
  private store = inject(Store);
  readonly deleteDialog = inject(DeleteDialogService);

  jobRelations$ = this.store.select(getQuoteRelationsWithStatus);
  quoteRelationsIsLoading$ = this.store.select(getQuoteRelationsIsLoading);
  quoteRelationsIsLoaded$ = this.store.select(getQuoteRelationsIsLoaded);
  jobRelationsIsLoading$ = this.store.select(getJobRelationsIsLoading);
  jobRelationsIsLoaded$ = this.store.select(getJobRelationsIsLoaded);

  readonly colDefs: ColDef[] = [
    {
      headerName: 'Chain Name',
      width: 150,
      filter: 'agTextColumnFilter',
      filterParams: {
        defaultToNothingSelected: true,
      },
      valueGetter: (params) => {
        return params.data?.pair?.pool?.chain?.name || '-';
      },
    },
    {
      headerName: 'Dex Name',
      width: 150,
      filter: 'agTextColumnFilter',
      filterParams: {
        defaultToNothingSelected: true,
      },
      valueGetter: (params) => {
        return params.data?.pair?.pool?.dex?.name || '-';
      },
    },
    {
      headerName: 'Pool Address',
      width: 150,
      filter: 'agTextColumnFilter',
      filterParams: {
        defaultToNothingSelected: true,
      },
      valueGetter: (params) => {
        return params.data?.pair?.pool?.poolAddress || '-';
      },
    },
    {
      headerName: 'Dex version',
      width: 150,
      filter: 'agTextColumnFilter',
      filterParams: {
        defaultToNothingSelected: true,
      },
      valueGetter: (params) => {
        return params.data?.pair?.pool?.version || '-';
      },
    },
    {
      headerName: 'Fee',
      width: 150,
      filter: 'agTextColumnFilter',
      filterParams: {
        defaultToNothingSelected: true,
      },
      valueGetter: (params) => {
        return params.data?.pair?.pool?.fee || '-';
      },
    },
    {
      headerName: 'Pair ID',
      width: 150,
      filter: 'agTextColumnFilter',
      filterParams: {
        defaultToNothingSelected: true,
      },
      valueGetter: (params) => {
        return params.data?.pair?.pairId || '-';
      },
    },
    {
      headerName: 'Token 1',
      width: 150,
      filter: 'agTextColumnFilter',
      filterParams: {
        defaultToNothingSelected: true,
      },
      valueGetter: (params) => {
        return params.data?.pair?.pool?.token?.tokenId || '-';
      },
    },
    {
      headerName: 'Token 2',
      width: 150,
      filter: 'agTextColumnFilter',
      filterParams: {
        defaultToNothingSelected: true,
      },
      valueGetter: (params) => {
        return params.data?.pair?.pool?.token2?.tokenId || '-';
      },
    },
    {
      headerName: 'Token In',
      width: 150,
      filter: 'agTextColumnFilter',
      filterParams: {
        defaultToNothingSelected: true,
      },
      valueGetter: (params) => {
        return params.data?.pair?.tokenIn?.tokenId || '-';
      },
    },
    {
      headerName: 'Token Out',
      width: 150,
      filter: 'agTextColumnFilter',
      filterParams: {
        defaultToNothingSelected: true,
      },
      valueGetter: (params) => {
        return params.data?.pair?.tokenOut?.tokenId || '-';
      },
    },
    {
      headerName: 'Amount',
      width: 150,
      filter: 'agTextColumnFilter',
      filterParams: {
        defaultToNothingSelected: true,
      },
      valueGetter: (params) => {
        return params.data?.quote?.amount || '-';
      },
    },
    {
      headerName: 'Side',
      width: 150,
      filter: 'agTextColumnFilter',
      filterParams: {
        defaultToNothingSelected: true,
      },
      valueGetter: (params) => {
        return params.data?.quote?.side || '-';
      },
    },
    {
      headerName: 'Block Tag',
      width: 150,
      filter: 'agTextColumnFilter',
      filterParams: {
        defaultToNothingSelected: true,
      },
      valueGetter: (params) => {
        return params.data?.quote?.blockTag || '-';
      },
    },
    {
      headerName: 'Quote Source',
      width: 150,
      filter: 'agTextColumnFilter',
      filterParams: {
        defaultToNothingSelected: true,
      },
      valueGetter: (params) => {
        return params.data?.quote?.quoteSource || '-';
      },
    },
    {
      headerName: 'Quote ID',
      width: 150,
      filter: 'agTextColumnFilter',
      filterParams: {
        defaultToNothingSelected: true,
      },
      valueGetter: (params) => {
        return params.data?.quote?.quoteId || '-';
      },
    },
  ];

  readonly defaultColDef: ColDef = {
    filter: true,
    sortable: true,
    cellStyle: { textAlign: 'center'},
    suppressMovable: true,
    headerClass: 'align-center',
  };

  events($event: any) {
    this.emitter.emit({
      event: 'AgGridJobRelationsContainer:ACTIVE_RELATIONS',
      data: $event.row.selectedNodes.map((item: any) => item.data.pairQuoteRelationId),
      fullData: $event.row.selectedNodes.map((item: any) => item.data),
    });
  }
}
