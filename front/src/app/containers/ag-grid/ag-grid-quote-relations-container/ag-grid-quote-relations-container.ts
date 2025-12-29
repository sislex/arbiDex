import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { DeleteDialogService } from '../../../services/delete-dialog-service';
import {
  getBotsDataIsLoaded,
  getBotsDataIsLoading,
  getPairsDataResponse,
} from '../../../+state/db-config/db-config.selectors';
import { ColDef } from 'ag-grid-community';
import { setBotsData } from '../../../+state/db-config/db-config.actions';
import { AgGrid } from '../../../components/ag-grid/ag-grid';
import { HeaderContentLayout } from '../../../components/layouts/header-content-layout/header-content-layout';
import { TitleTableButton } from '../../../components/title-table-button/title-table-button';

@Component({
  selector: 'app-ag-grid-quote-relations-container',
  imports: [
    AgGrid,
    HeaderContentLayout,
    TitleTableButton,
  ],
  templateUrl: './ag-grid-quote-relations-container.html',
  styleUrl: './ag-grid-quote-relations-container.scss',
})
export class AgGridQuoteRelationsContainer {

  private store = inject(Store);
  readonly deleteDialog = inject(DeleteDialogService);

  botsDataResponse$ = this.store.select(getPairsDataResponse);
  botsDataIsLoading$ = this.store.select(getBotsDataIsLoading);
  botsDataIsLoaded$ = this.store.select(getBotsDataIsLoaded);

  readonly colDefs: ColDef[] = [
    // {
    //   field: "chainName",
    //   headerName: 'Chain Name',
    //   width: 150,
    //   filter: 'agTextColumnFilter',
    //   filterParams: {
    //     defaultToNothingSelected: true,
    //   },
    // },
    {
      headerName: 'Chain Name',
      width: 150,
      filter: 'agTextColumnFilter',
      filterParams: {
        defaultToNothingSelected: true,
      },
      valueGetter: (params) => {
        return params.data?.pool?.dex?.name || '-';
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
        return params.data?.pool?.dex?.name || '-';
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
        return params.data?.pool?.address || '-';
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
        return params.data?.pool?.version || '-';
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
        return params.data?.pool?.fee || '-';
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
        return params.data?.pool?.token1?.tokenId || '-';
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
        return params.data?.pool?.token2?.tokenId || '-';
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
        return params.data?.tokenIn?.tokenId || '-';
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
        return params.data?.tokenOut?.tokenId || '-';
      },
    },


    // {
    //   field: "botId",
    //   headerName: 'Bot ID',
    //   width: 150,
    //   filter: 'agTextColumnFilter',
    //   filterParams: {
    //     defaultToNothingSelected: true,
    //   },
    // },
  ];

  readonly defaultColDef: ColDef = {
    filter: true,
    sortable: true,
    cellStyle: { textAlign: 'center'},
    suppressMovable: true,
    headerClass: 'align-center',
  };

  constructor() {
    this.store.dispatch(setBotsData());
  }

  onAction($event: any, row: any) {
    if ($event.event === 'Actions:ACTION_CLICKED') {
      // if ($event.actionType === 'delete') {
      //   this.openDeleteDialog(row);
      // } else if ($event.actionType === 'edit') {
      //   this.openEditDialog(row);
      // }
    }
  }

  events($event: any) {
    console.log('$event:::', $event.row.selectedNodes.map((item: any) => item.data))
  }

  createRelation() {
    // this.store.dispatch(createChain({ data: result.formData }));
  }

  deleteRelation() {
    // this.store.dispatch(deletingChain({ chainId: row.chainId }));
  }

}
