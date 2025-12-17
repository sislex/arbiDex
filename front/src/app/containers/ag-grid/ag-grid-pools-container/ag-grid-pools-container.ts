import { Component, inject } from '@angular/core';
import {ColDef} from 'ag-grid-community';
import {AgGrid} from '../../../components/ag-grid/ag-grid';
import { HeaderContentLayout } from '../../../components/layouts/header-content-layout/header-content-layout';
import { TitleTableButton } from '../../../components/title-table-button/title-table-button';
import { Store } from '@ngrx/store';
import { PoolDialogService } from '../../../services/pool-dialog-service';
import {
  getPoolsDataIsLoaded,
  getPoolsDataIsLoading,
  getPoolsDataResponse,
} from '../../../+state/db-config/db-config.selectors';
import { AsyncPipe } from '@angular/common';
import { Loader } from '../../../components/loader/loader';

@Component({
  selector: 'app-ag-grid-pools-container',
  imports: [
    AgGrid,
    HeaderContentLayout,
    TitleTableButton,
    AsyncPipe,
    Loader,
  ],
  templateUrl: './ag-grid-pools-container.html',
  styleUrl: './ag-grid-pools-container.scss',
})
export class AgGridPoolsContainer {
  private store = inject(Store);
  readonly poolDialog = inject(PoolDialogService);

  list$: any;
  poolsDataResponse$ = this.store.select(getPoolsDataResponse);
  poolsDataIsLoading$ = this.store.select(getPoolsDataIsLoading);
  poolsDataIsLoaded$ = this.store.select(getPoolsDataIsLoaded);

  colDefs: ColDef[] = [
    {
      field: "#",
      headerName: '#',
      width: 50,
      valueGetter: params => {
        if (!params.node || params.node.rowIndex == null) return '';
        return params.node.rowIndex + 1;
      },
    },
    {
      field: "poolId",
      headerName: 'Pool ID',
    },
    {
      field: "poolAddress",
      headerName: 'Pool Address',
    },
    {
      field: "chainId",
      headerName: 'Chain ID',
    },
    {
      field: "dexId",
      headerName: 'Dex ID',
    },
    {
      field: "version",
      headerName: 'Dex version',
    },
    {
      field: "baseTokenId",
      headerName: 'Base token ID',
    },
    {
      field: "quoteTokenId",
      headerName: 'Quote token ID',
    },
  ];

  defaultColDef: ColDef = {
    sortable: false,
    cellStyle: { textAlign: 'center'},
    suppressMovable: true,
    headerClass: 'align-center',
    flex: 1
  };

  actions($event: any, note: any) {
    if (note === 'add' ) {
      this.openCreateDialog();
    }
  }

  openCreateDialog() {
    this.poolDialog.openCreate(this.list$).subscribe(result => {
      if (result?.data === 'add') {
        // this.store.dispatch(createPool({ data: result.formData }));
      }
    });
  }

}
