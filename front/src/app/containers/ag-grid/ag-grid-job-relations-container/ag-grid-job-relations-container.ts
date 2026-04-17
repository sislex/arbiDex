import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { DeleteDialogService } from '../../../services/delete-dialog-service';
import { ColDef } from 'ag-grid-community';
import { AgGrid } from '../../../components/ag-grid/ag-grid';
import { HeaderContentLayout } from '../../../components/layouts/header-content-layout/header-content-layout';
import { TitleTableButton } from '../../../components/title-table-button/title-table-button';
import {
  getActiveQuoteRelations,
  getJobRelationsIsLoaded,
  getJobRelationsIsLoading,
  getQuoteRelationsIsLoaded,
  getQuoteRelationsIsLoading,
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
export class AgGridJobRelationsContainer implements OnInit {
  @Input() currentJobId: number = 0;
  @Output() emitter = new EventEmitter();
  private store = inject(Store);
  readonly deleteDialog = inject(DeleteDialogService);

  activeQuoteRelations$ = this.store.select(getActiveQuoteRelations);
  quoteRelationsIsLoading$ = this.store.select(getQuoteRelationsIsLoading);
  quoteRelationsIsLoaded$ = this.store.select(getQuoteRelationsIsLoaded);
  jobRelationsIsLoading$ = this.store.select(getJobRelationsIsLoading);
  jobRelationsIsLoaded$ = this.store.select(getJobRelationsIsLoaded);
  filteredItemCount: number = 0;

  readonly colDefs: ColDef[] = [
    {
      headerName: 'Quote ID',
      flex: 1,
      filter: 'agTextColumnFilter',
      filterParams: {
        defaultToNothingSelected: true,
      },
      valueGetter: (params) => {
        return params.data?.quote?.quoteId || '-';
      },
    },
    {
      headerName: 'Dex Name',
      flex: 1,
      filter: 'agTextColumnFilter',
      filterParams: {
        defaultToNothingSelected: true,
      },
      valueGetter: (params) => {
        return params.data?.pair?.pool?.dex?.name || '-';
      },
    },
    {
      headerName: 'Dex version',
      flex: 1,
      filter: 'agTextColumnFilter',
      filterParams: {
        defaultToNothingSelected: true,
      },
      valueGetter: (params) => {
        return params.data?.pair?.pool?.version || '-';
      },
    },
    {
      headerName: 'Token In Symbol',
      flex: 1,
      filter: 'agTextColumnFilter',
      filterParams: {
        defaultToNothingSelected: true,
      },
      valueGetter: (params) => {
        return params.data?.pair?.tokenIn?.symbol || '-';
      },
    },
    {
      headerName: 'Token Out Symbol',
      flex: 1,
      filter: 'agTextColumnFilter',
      filterParams: {
        defaultToNothingSelected: true,
      },
      valueGetter: (params) => {
        return params.data?.pair?.tokenOut?.symbol || '-';
      },
    },
    {
      headerName: 'Token In',
      flex: 1,
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
      flex: 1,
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
      flex: 1,
      filter: 'agTextColumnFilter',
      filterParams: {
        defaultToNothingSelected: true,
      },
      valueGetter: (params) => {
        return params.data?.quote?.amount || '-';
      },
    },
    {
      headerName: 'Fee',
      flex: 1,
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
      flex: 1,
      filter: 'agTextColumnFilter',
      filterParams: {
        defaultToNothingSelected: true,
      },
      valueGetter: (params) => {
        return params.data?.pair?.pairId || '-';
      },
    },
    {
      headerName: 'Chain Name',
      flex: 1,
      filter: 'agTextColumnFilter',
      filterParams: {
        defaultToNothingSelected: true,
      },
      valueGetter: (params) => {
        return params.data?.pair?.pool?.chain?.name || '-';
      },
    },
  ];

  readonly defaultColDef: ColDef = {
    filter: true,
    sortable: true,
    cellStyle: { textAlign: 'center', userSelect: 'text'},
    minWidth: 110,
    suppressMovable: true,
    headerClass: 'align-center',
  };
  ngOnInit() {
    this.store.select(getActiveQuoteRelations).subscribe(data => {
      this.filteredItemCount = data?.length || 0;
    });
  }

  events($event: any) {
    if ($event.event === 'AgGrid:SET_CHECKBOX_ROW') {
      this.emitter.emit({
        event: 'AgGridJobRelationsContainer:ACTIVE_RELATIONS',
        data: $event.row.selectedNodes.map((item: any) => item.data.pairQuoteRelationId),
        fullData: $event.row.selectedNodes.map((item: any) => item.data),
      });
    }

    if ($event.event === 'AgGrid:MODEL_UPDATED') {
      this.filteredItemCount = $event.rowsDisplayed;
    }
  }
}
