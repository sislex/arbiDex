import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { DeleteDialogService } from '../../../services/delete-dialog-service';
import { getPairsDataIsLoaded, getPairsDataIsLoading,
} from '../../../+state/db-config/db-config.selectors';
import { ColDef } from 'ag-grid-community';
import { AgGrid } from '../../../components/ag-grid/ag-grid';
import { HeaderContentLayout } from '../../../components/layouts/header-content-layout/header-content-layout';
import { TitleTableButton } from '../../../components/title-table-button/title-table-button';
import {
  getPairsWithRelations,
  getQuoteRelationsByQuoteIdIsLoaded,
  getQuoteRelationsByQuoteIdIsLoading,
} from '../../../+state/relations/relations.selectors';
import { AsyncPipe } from '@angular/common';
import { Loader } from '../../../components/loader/loader';

@Component({
  selector: 'app-ag-grid-quote-relations-container',
  imports: [
    AgGrid,
    HeaderContentLayout,
    TitleTableButton,
    AsyncPipe,
    Loader,
  ],
  templateUrl: './ag-grid-quote-relations-container.html',
  styleUrl: './ag-grid-quote-relations-container.scss',
})
export class AgGridQuoteRelationsContainer {
  @Input() currentQuoteId: number = 0;
  @Output() emitter = new EventEmitter();
  private store = inject(Store);
  readonly deleteDialog = inject(DeleteDialogService);

  pairsWithRelations$ = this.store.select(getPairsWithRelations);
  pairsDataIsLoading$ = this.store.select(getPairsDataIsLoading);
  pairsDataIsLoaded$ = this.store.select(getPairsDataIsLoaded);
  quoteRelationsIsLoading$ = this.store.select(getQuoteRelationsByQuoteIdIsLoading);
  quoteRelationsIsLoaded$ = this.store.select(getQuoteRelationsByQuoteIdIsLoaded);

  readonly colDefs: ColDef[] = [
    {
      headerName: 'Chain Name',

      filter: 'agTextColumnFilter',
      filterParams: {
        defaultToNothingSelected: true,
      },
      valueGetter: (params) => {
        return params.data?.pool?.chain?.name || '-';
      },
    },
    {
      headerName: 'Dex Name',

      filter: 'agTextColumnFilter',
      filterParams: {
        defaultToNothingSelected: true,
      },
      valueGetter: (params) => {
        return params.data?.pool?.dex?.name || '-';
      },
    },
    {
      headerName: 'Pool Address',

      filter: 'agTextColumnFilter',
      filterParams: {
        defaultToNothingSelected: true,
      },
      valueGetter: (params) => {
        return params.data?.pool?.poolAddress || '-';
      },
    },
    {
      headerName: 'Dex version',

      filter: 'agTextColumnFilter',
      filterParams: {
        defaultToNothingSelected: true,
      },
      valueGetter: (params) => {
        return params.data?.pool?.version || '-';
      },
    },
    {
      headerName: 'Fee',

      filter: 'agTextColumnFilter',
      filterParams: {
        defaultToNothingSelected: true,
      },
      valueGetter: (params) => {
        return params.data?.pool?.fee || '-';
      },
    },
    {
      headerName: 'Token 1',

      filter: 'agTextColumnFilter',
      filterParams: {
        defaultToNothingSelected: true,
      },
      valueGetter: (params) => {
        return params.data?.pool?.token?.tokenName || '-';
      },
    },
    {
      headerName: 'Token 2',

      filter: 'agTextColumnFilter',
      filterParams: {
        defaultToNothingSelected: true,
      },
      valueGetter: (params) => {
        return params.data?.pool?.token2?.tokenName || '-';
      },
    },
    {
      headerName: 'Token In',

      filter: 'agTextColumnFilter',
      filterParams: {
        defaultToNothingSelected: true,
      },
      valueGetter: (params) => {
        return params.data?.tokenIn?.tokenName || '-';
      },
    },
    {
      headerName: 'Token Out',

      filter: 'agTextColumnFilter',
      filterParams: {
        defaultToNothingSelected: true,
      },
      valueGetter: (params) => {
        return params.data?.tokenOut?.tokenName || '-';
      },
    },
  ];

  readonly defaultColDef: ColDef = {
    filter: true,
    sortable: true,
    flex: 1,
    minWidth: 150,
    cellStyle: { textAlign: 'center'},
    suppressMovable: true,
    headerClass: 'align-center',
  };

  events($event: any) {
    this.emitter.emit({
      event: 'AgGridQuoteRelationsContainer:ACTIVE_RELATIONS',
      data: $event.row.selectedNodes.map((item: any) => item.data.pairId),
    });
  }
}
