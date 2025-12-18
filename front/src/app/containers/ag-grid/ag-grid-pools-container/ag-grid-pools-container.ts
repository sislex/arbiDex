import { Component, inject, OnInit } from '@angular/core';
import {ColDef} from 'ag-grid-community';
import {AgGrid} from '../../../components/ag-grid/ag-grid';
import { HeaderContentLayout } from '../../../components/layouts/header-content-layout/header-content-layout';
import { TitleTableButton } from '../../../components/title-table-button/title-table-button';
import { Store } from '@ngrx/store';
import { PoolDialogService } from '../../../services/pool-dialog-service';
import {
  getChainsDataResponse, getDexesDataResponse,
  getPoolsDataIsLoaded,
  getPoolsDataIsLoading,
  getPoolsDataResponse, getTokensDataResponse, getVersionList,
} from '../../../+state/db-config/db-config.selectors';
import { AsyncPipe } from '@angular/common';
import { Loader } from '../../../components/loader/loader';
import { createPool, deletingPools, editPool, setPoolsData } from '../../../+state/db-config/db-config.actions';
import { map } from 'rxjs';
import { ActionsContainer } from '../../actions-container/actions-container';
import { DeleteDialogService } from '../../../services/delete-dialog-service';

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
export class AgGridPoolsContainer implements OnInit {
  private store = inject(Store);
  readonly poolDialog = inject(PoolDialogService);
  readonly deleteDialog = inject(DeleteDialogService);

  chainsList$ = this.store.select(getChainsDataResponse).pipe(
    map(item =>
      item.map(item => ({
        id: item.chainId,
        name: item.name,
      }))
    )
  );

  tokensList$ = this.store.select(getTokensDataResponse).pipe(
    map(item =>
      item.map(item => ({
        id: item.tokenId,
        name: item.tokenName,
      }))
    )
  );

  dexesList$ = this.store.select(getDexesDataResponse).pipe(
    map(item =>
      item.map(item => ({
        id: item.dexId,
        name: item.name,
      }))
    )
  );

  versionList$ = this.store.select(getVersionList).pipe(
    map(item =>
      item.map(item => ({
        id: item,
        name: item,
      }))
    )
  );

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
      flex: 1,
    },
    {
      field: "poolAddress",
      headerName: 'Pool Address',
      flex: 1,
    },
    {
      field: "chainId",
      headerName: 'Chain ID',
      flex: 1,
    },
    {
      field: "dexId",
      headerName: 'Dex ID',
      flex: 1,
    },
    {
      field: "version",
      headerName: 'Dex version',
      flex: 1,
    },
    {
      field: "fee",
      headerName: 'Fee',
      flex: 1,
    },
    {
      field: "baseTokenId",
      headerName: 'Base token ID',
      flex: 1,
    },
    {
      field: "quoteTokenId",
      headerName: 'Quote token ID',
      flex: 1,
    },
    {
      headerName: 'Actions',
      width: 125,
      cellRenderer: ActionsContainer,
      cellRendererParams: {
        onAction: this.onAction.bind(this),
      },
    },
  ];

  defaultColDef: ColDef = {
    sortable: false,
    cellStyle: { textAlign: 'center'},
    suppressMovable: true,
    headerClass: 'align-center',
  };

  ngOnInit() {
    this.store.dispatch(setPoolsData());
  };

  onAction($event: any, row: any) {
    if ($event.event === 'Actions:ACTION_CLICKED') {
      if ($event.actionType === 'delete') {
        this.openDeleteDialog(row);
      } else if ($event.actionType === 'edit') {
        this.openEditDialog(row);
      }
    }
  }

  actions($event: any, note: any) {
    if (note === 'add' ) {
      this.openCreateDialog();
    }
  }

  openCreateDialog() {
    this.poolDialog.openCreate(this.chainsList$, this.tokensList$, this.dexesList$, this.versionList$).subscribe(result => {
      if (result?.data === 'add') {
        this.store.dispatch(createPool({ data: result.formData }));
      }
    });
  }

  openEditDialog(row: any) {
    this.poolDialog.openEdit(row, this.chainsList$, this.tokensList$, this.dexesList$, this.versionList$).subscribe(result => {
      if (result?.data === 'edit') {
        this.store.dispatch(editPool({ data: result.formData }));
      }
    });
  }

  openDeleteDialog(row: any) {
    this.deleteDialog.openDelete(row, 'pool').subscribe(result => {
      if (result?.data === 'yes') {
        this.store.dispatch(deletingPools({ poolId: row.poolId }));
      }
    });
  }
}
