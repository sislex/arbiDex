import {Component, EventEmitter, inject, Input, OnInit, Output} from '@angular/core';
import {AgGrid} from "../../../components/ag-grid/ag-grid";
import {AsyncPipe} from "@angular/common";
import {HeaderContentLayout} from "../../../components/layouts/header-content-layout/header-content-layout";
import {TitleTableButton} from "../../../components/title-table-button/title-table-button";
import {Store} from '@ngrx/store';
import {DeleteDialogService} from '../../../services/delete-dialog-service';
import {getInactiveQuoteRelations} from '../../../+state/relations/relations.selectors';
import {ColDef} from 'ag-grid-community';

@Component({
  selector: 'app-ag-grid-job-not-relations-container',
    imports: [
        AgGrid,
        AsyncPipe,
        HeaderContentLayout,
        TitleTableButton
    ],
  templateUrl: './ag-grid-job-not-relations-container.html',
  styleUrl: './ag-grid-job-not-relations-container.scss',
})
export class AgGridJobNotRelationsContainer implements OnInit {
  @Input() currentJobId: number = 0;
  @Output() emitter = new EventEmitter();
  private store = inject(Store);
  readonly deleteDialog = inject(DeleteDialogService);

  inactiveQuoteRelations$ = this.store.select(getInactiveQuoteRelations);
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
      headerName: 'Token 0',
      flex: 1,
      filter: 'agTextColumnFilter',
      filterParams: {
        defaultToNothingSelected: true,
      },
      valueGetter: (params) => {
        return params.data?.pair?.pool?.token0?.tokenId || '-';
      },
    },
    {
      headerName: 'Token 1',
      flex: 1,
      filter: 'agTextColumnFilter',
      filterParams: {
        defaultToNothingSelected: true,
      },
      valueGetter: (params) => {
        return params.data?.pair?.pool?.token1?.tokenId || '-';
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
    this.store.select(getInactiveQuoteRelations).subscribe(data => {
      this.filteredItemCount = data?.length || 0;
    });
  }

  events($event: any) {
    if ($event.event === 'AgGrid:SET_CHECKBOX_ROW') {
      this.emitter.emit({
        event: 'AgGridJobNotRelationsContainer:ACTIVE_RELATIONS',
        data: $event.row.selectedNodes.map((item: any) => item.data.pairQuoteRelationId),
        fullData: $event.row.selectedNodes.map((item: any) => item.data)
      });
    }

    if ($event.event === 'AgGrid:MODEL_UPDATED') {
      this.filteredItemCount = $event.rowsDisplayed;
    }
  }
}
