import {Component, EventEmitter, inject, Input, Output} from '@angular/core';
import {Store} from '@ngrx/store';
import {DeleteDialogService} from '../../../services/delete-dialog-service';
import {
  getInactivePairs,
} from '../../../+state/relations/relations.selectors';
import {ColDef} from 'ag-grid-community';
import {HeaderContentLayout} from '../../../components/layouts/header-content-layout/header-content-layout';
import {TitleTableButton} from '../../../components/title-table-button/title-table-button';
import {AsyncPipe} from '@angular/common';
import {AgGrid} from '../../../components/ag-grid/ag-grid';

@Component({
  selector: 'app-ag-grid-quote-not-relations-container',
  imports: [
    HeaderContentLayout,
    TitleTableButton,
    AsyncPipe,
    AgGrid,
  ],
  templateUrl: './ag-grid-quote-not-relations-container.html',
  styleUrl: './ag-grid-quote-not-relations-container.scss',
})
export class AgGridQuoteNotRelationsContainer {
  @Input() currentQuoteId: number = 0;
  @Output() emitter = new EventEmitter();
  private store = inject(Store);
  readonly deleteDialog = inject(DeleteDialogService);

  inactivePairs$ = this.store.select(getInactivePairs);

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
    {
      headerName: 'Token In Address',

      filter: 'agTextColumnFilter',
      filterParams: {
        defaultToNothingSelected: true,
      },
      valueGetter: (params) => {
        return params.data?.tokenIn?.address || '-';
      },
    },
    {
      headerName: 'Token Out Address',

      filter: 'agTextColumnFilter',
      filterParams: {
        defaultToNothingSelected: true,
      },
      valueGetter: (params) => {
        return params.data?.tokenOut?.address || '-';
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
      event: 'AgGridQuoteNotRelationsContainer:ACTIVE_RELATIONS',
      data: $event.row.selectedNodes.map((item: any) => item.data.pairId),
    });
  }

}
