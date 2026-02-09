import {Component, EventEmitter, inject, Input, Output} from '@angular/core';
import {Store} from '@ngrx/store';
import {ColDef} from 'ag-grid-community';
import {HeaderContentLayout} from '../../../components/layouts/header-content-layout/header-content-layout';
import {TitleTableButton} from '../../../components/title-table-button/title-table-button';
import {AgGrid} from '../../../components/ag-grid/ag-grid';
import {AsyncPipe} from '@angular/common';
import {
  getQuoteFullDataResponse,
} from '../../../+state/db-config/db-config.selectors';

@Component({
  selector: 'app-ag-grid-one-quote-container',
  imports: [
    HeaderContentLayout,
    TitleTableButton,
    AgGrid,
    AsyncPipe
  ],
  templateUrl: './ag-grid-one-quote-container.html',
  styleUrl: './ag-grid-one-quote-container.scss',
})
export class AgGridOneQuoteContainer {
  @Input() currentJobId: number = 0;
  @Output() emitter = new EventEmitter();
  private store = inject(Store);

  quoteFullDataResponse$ = this.store.select(getQuoteFullDataResponse);

  readonly colDefs: ColDef[] = [
    {
      field: "quoteId",
      headerName: 'Quote ID',
      flex: 1,
    },
    {
      field: "amount",
      headerName: 'Amount',
      flex: 1,
    },
    {
      field: "side",
      headerName: 'Side',
      flex: 1,
    },
    {
      field: "blockTag",
      headerName: 'Block Tag',
      flex: 1,
    },
    {
      field: "quoteSource",
      headerName: 'Quote Source',
      flex: 1,
    },
    {
      headerName: 'Quote Token',
      flex: 1,
      valueGetter: (params) => {
        return params.data?.tokenName || '-';
      },
    },
    {
      headerName: 'Pairs count',
      flex: 1,
      valueGetter: (params) => {
        return params.data?.pairsCount || '-';
      },
    }
  ];

  readonly defaultColDef: ColDef = {
    headerClass: 'align-center',
    cellStyle: {
      textAlign: 'center',
      cursor: 'pointer',
      userSelect: 'text'
    },
  };

  events($event: any) {
    this.emitter.emit({
      event: 'AgGridJobRelationsContainer:ACTIVE_RELATIONS',
      data: $event.row.selectedNodes.map((item: any) => item.data.pairQuoteRelationId),
      fullData: $event.row.selectedNodes.map((item: any) => item.data),
    });
  }

}
