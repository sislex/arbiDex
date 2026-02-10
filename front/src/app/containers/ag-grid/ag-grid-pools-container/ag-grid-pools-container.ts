import {Component, inject, OnInit} from '@angular/core';
import {ColDef} from 'ag-grid-community';
import {AgGrid} from '../../../components/ag-grid/ag-grid';
import { HeaderContentLayout } from '../../../components/layouts/header-content-layout/header-content-layout';
import { TitleTableButton } from '../../../components/title-table-button/title-table-button';
import { Store } from '@ngrx/store';
import { PoolDialogService } from '../../../services/pool-dialog-service';
import {
  getFullPoolsData,
  getFullPoolsDataIsReady,
} from '../../../+state/db-config/db-config.selectors';
import { AsyncPipe } from '@angular/common';
import { Loader } from '../../../components/loader/loader';
import {
  createPool,
  deletingPools,
  editPool,
  initPoolsPage
} from '../../../+state/db-config/db-config.actions';
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

  poolsDataResponse$ = this.store.select(getFullPoolsData);
  poolsDataIsReady$ = this.store.select(getFullPoolsDataIsReady);
  filteredItemCount: number = 0;

  readonly colDefs: ColDef[] = [
    {
      field: "poolId",
      headerName: 'Pool ID',
      flex: 1,
      filter: true,
      sortable: true,
    },
    {
      field: "poolAddress",
      headerName: 'Pool Address',
      flex: 1,
      filter: true,
      sortable: true,
    },
    {
      headerName: 'Chain ID',
      flex: 1,
      filter: true,
      sortable: true,
      valueGetter: (params) => {
        return params.data?.chainName || '-';
      },
    },
    {
      headerName: 'Dex Name',
      flex: 1,
      filter: true,
      sortable: true,
      valueGetter: (params) => {
        return params.data?.dexName || '-';
      },
    },
    {
      field: "version",
      headerName: 'Dex version',
      flex: 1,
      filter: true,
      sortable: true,
    },
    {
      field: "fee",
      headerName: 'Fee',
      flex: 1,
      filter: true,
      sortable: true,
    },
    {
      headerName: 'Token 1',
      flex: 1,
      filter: true,
      sortable: true,
      valueGetter: (params) => {
        return params.data?.token0Name || '-';
      },
    },
    {
      headerName: 'Token 2',
      flex: 1,
      filter: true,
      sortable: true,
      valueGetter: (params) => {
        return params.data?.token1Name || '-';
      },
    },
    {
      headerName: 'Reserve 1',
      flex: 1,
      filter: true,
      sortable: true,
      valueGetter: (params) => {
        return params.data?.reserve0 || '-';
      },
    },
    {
      headerName: 'Reserve 2',
      flex: 1,
      filter: true,
      sortable: true,
      valueGetter: (params) => {
        return params.data?.reserve1 || '-';
      },
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

  readonly defaultColDef: ColDef = {
    sortable: false,
    cellStyle: { textAlign: 'center', userSelect: 'text',},
    suppressMovable: true,
    headerClass: 'align-center',
  };

  ngOnInit() {
    this.store.dispatch(initPoolsPage());
    this.store.select(getFullPoolsData).subscribe(data => {
      this.filteredItemCount = data?.length || 0;
    });
  }

  onAction($event: any, row: any) {
    if ($event.event === 'Actions:ACTION_CLICKED') {
      if ($event.actionType === 'delete') {
        this.openDeleteDialog(row);
      } else if ($event.actionType === 'edit') {
        this.openEditDialog(row);
      }
    }
  }

  actions(_: any, note: string) {
    if (note === 'add' ) {
      this.openCreateDialog();
    }
  }

  openCreateDialog() {
    this.poolDialog.openCreate().subscribe(result => {
      if (result?.data === 'add') {
        this.store.dispatch(createPool({ data: result.formData }));
      }
    });
  }

  openEditDialog(row: any) {
    this.poolDialog.openEdit(row).subscribe(result => {
      if (result?.data === 'save') {
        this.store.dispatch(editPool({ data: result.formData }));
      }
    });
  }

  openDeleteDialog(row: any) {
    this.deleteDialog.openDelete(row.poolAddress, 'pool').subscribe(result => {
      if (result?.data === 'yes') {
        this.store.dispatch(deletingPools({ poolId: row.poolId }));
      }
    });
  }

  events($event: any) {
    if ($event.event === 'AgGrid:MODEL_UPDATED') {
      this.filteredItemCount = $event.rowsDisplayed;
    }
  }
}
