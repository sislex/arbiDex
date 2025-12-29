import { Component, inject } from '@angular/core';
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
  getQuoteRelationsIsLoaded,
  getQuoteRelationsIsLoading,
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
  private store = inject(Store);
  readonly deleteDialog = inject(DeleteDialogService);

  pairsWithRelations$ = this.store.select(getPairsWithRelations);
  pairsDataIsLoading$ = this.store.select(getPairsDataIsLoading);
  pairsDataIsLoaded$ = this.store.select(getPairsDataIsLoaded);
  quoteRelationsIsLoading$ = this.store.select(getQuoteRelationsIsLoading);
  quoteRelationsIsLoaded$ = this.store.select(getQuoteRelationsIsLoaded);

  readonly colDefs: ColDef[] = [
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
