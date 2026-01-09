import { Component, inject } from '@angular/core';
import { AgGrid } from '../../../components/ag-grid/ag-grid';
import { TitleTableButton } from '../../../components/title-table-button/title-table-button';
import { HeaderContentLayout } from '../../../components/layouts/header-content-layout/header-content-layout';
import { Store } from '@ngrx/store';
import { DeleteDialogService } from '../../../services/delete-dialog-service';
import { Router } from '@angular/router';
import {
  getChainsDataResponse,
  getJobsDataIsLoaded,
  getJobsDataIsLoading,
  getJobsDataResponse, getRpcUrlDataResponse, getRpcUrlsDataIsLoaded, getRpcUrlsDataIsLoading,
} from '../../../+state/db-config/db-config.selectors';
import { ColDef } from 'ag-grid-community';
import { ActionsContainer } from '../../actions-container/actions-container';
import { RpcUrlsDialogService } from '../../../services/rpc-urls-dialog-service';
import { map } from 'rxjs';
import { setRpcUrlsData, setTokensData } from '../../../+state/db-config/db-config.actions';
import { AsyncPipe } from '@angular/common';
import { Loader } from '../../../components/loader/loader';

@Component({
  selector: 'app-ag-grid-rpc-urls-container',
  imports: [
    AgGrid,
    TitleTableButton,
    HeaderContentLayout,
    AsyncPipe,
    Loader,
  ],
  templateUrl: './ag-grid-rpc-urls-container.html',
  styleUrl: './ag-grid-rpc-urls-container.scss',
})
export class AgGridRpcUrlsContainer {
  private store = inject(Store);
  readonly deleteDialog = inject(DeleteDialogService);
  readonly rpcUrlDialog = inject(RpcUrlsDialogService);
  readonly router = inject(Router);

  rpcUrlsDataResponse$ = this.store.select(getRpcUrlDataResponse);
  rpcUrlsDataIsLoading$ = this.store.select(getRpcUrlsDataIsLoading);
  rpcUrlsDataIsLoaded$ = this.store.select(getRpcUrlsDataIsLoaded);


  chainsList$ = this.store.select(getChainsDataResponse).pipe(
    map(item =>
      item.map(item => ({
        id: item.chainId,
        name: item.name,
      }))
    )
  );

  readonly colDefs: ColDef[] = [
    {
      field: "rpcUrlId",
      headerName: 'Rpc Url Id',
      flex: 1,
    },
    {
      field: "rpcUrl",
      headerName: 'Rpc Url',
      flex: 1,
    },
    {
      headerName: 'Chain Id',
      flex: 1,
      valueGetter: (params) => {
        return params.data?.chain?.chainId || '-';
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
    cellStyle: { textAlign: 'center'},
    suppressMovable: true,
    headerClass: 'align-center',
  };

  constructor() {
    this.store.dispatch(setRpcUrlsData());
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

  actions($event: any, note?: any) {
    if ($event.event === 'Actions:ACTION_CLICKED') {
      if (note === 'add') {
        this.openCreateDialog();
      }
    } else if ($event.event === 'AgGrid:DOUBLE_CLICKED_ROW') {
      // this.router.navigate([`/data-view/rpc/${$event.row.data.rpcUrlId}`]);
    }
  }

  openCreateDialog() {
    this.rpcUrlDialog.openCreate(this.chainsList$).subscribe(result => {
      if (result?.data === 'add') {
        // this.store.dispatch(createJob({ data: result.formData }));
      }
    });
  }

  openEditDialog(row: any) {
    this.rpcUrlDialog.openEdit(row, this.chainsList$,).subscribe(result => {
      if (result?.data === 'save') {
        // this.store.dispatch(editJob({ data: result.formData }));
      }
    });
  }

  openDeleteDialog(row: any) {
    this.deleteDialog.openDelete(row.rpcUrlId, 'rpc').subscribe(result => {
      if (result?.data === 'yes') {
        // this.store.dispatch(deletingJob({ jobId: row.jobId }));
      }
    });
  }

}
