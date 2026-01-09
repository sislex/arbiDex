import { Component, inject } from '@angular/core';
import { AgGrid } from '../../../components/ag-grid/ag-grid';
import { HeaderContentLayout } from '../../../components/layouts/header-content-layout/header-content-layout';
import { TitleTableButton } from '../../../components/title-table-button/title-table-button';
import { ColDef } from 'ag-grid-community';
import { DeleteDialogService } from '../../../services/delete-dialog-service';
import { Store } from '@ngrx/store';
import { ActionsContainer } from '../../actions-container/actions-container';
import {
  getChainsDataResponse,
  getJobsDataIsLoaded,
  getJobsDataIsLoading,
  getJobsDataResponse, getRpcUrlDataResponse,
} from '../../../+state/db-config/db-config.selectors';
import { createJob, deletingJob, editJob, setJobsData } from '../../../+state/db-config/db-config.actions';
import { Loader } from '../../../components/loader/loader';
import { AsyncPipe } from '@angular/common';
import { Router } from '@angular/router';
import { JobDialogService } from '../../../services/job-dialog-service';
import { map } from 'rxjs';

@Component({
  selector: 'app-ag-grid-jobs-container',
  imports: [
    AgGrid,
    HeaderContentLayout,
    TitleTableButton,
    Loader,
    AsyncPipe,
  ],
  templateUrl: './ag-grid-jobs-container.html',
  styleUrl: './ag-grid-jobs-container.scss',
})
export class AgGridJobsContainer {
  private store = inject(Store);
  readonly deleteDialog = inject(DeleteDialogService);
  readonly jobDialog = inject(JobDialogService);
  readonly router = inject(Router);

  jobsDataResponse$ = this.store.select(getJobsDataResponse);
  jobsDataIsLoading$ = this.store.select(getJobsDataIsLoading);
  jobsDataIsLoaded$ = this.store.select(getJobsDataIsLoaded);

  chainsList$ = this.store.select(getChainsDataResponse).pipe(
    map(item =>
      item.map(item => ({
        id: item.chainId,
        name: item.name,
      }))
    )
  );

  rpcUrlList$ = this.store.select(getRpcUrlDataResponse).pipe(
    map(item =>
      item.map(item => ({
        id: item.rpcUrlId,
        name: item.rpcUrl,
      }))
    )
  );

  readonly colDefs: ColDef[] = [
    {
      field: "jobId",
      headerName: 'Job ID',
      flex: 1,
    },
    {
      field: "jobType",
      headerName: 'Job Type',
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
      headerName: 'Rpc Url',
      flex: 1,
      valueGetter: (params) => {
        return params.data?.rpcUrl?.rpcUrlId || '-';
      },
    },
    {
      field: "pairsCount",
      headerName: 'Pairs count',
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

  readonly defaultColDef: ColDef = {
    sortable: false,
    suppressMovable: true,
    headerClass: 'align-center',
    cellStyle: {
      textAlign: 'center',
      cursor: 'pointer',
    },
  };

  constructor() {
    this.store.dispatch(setJobsData());
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
      this.router.navigate([`/data-view/jobs/${$event.row.data.jobId}`]);
    }
  }

  openCreateDialog() {
    this.jobDialog.openCreate(this.chainsList$, this.rpcUrlList$).subscribe(result => {
      if (result?.data === 'add') {
        this.store.dispatch(createJob({ data: result.formData }));
      }
    });
  }

  openEditDialog(row: any) {
    this.jobDialog.openEdit(row, this.chainsList$, this.rpcUrlList$).subscribe(result => {
      if (result?.data === 'save') {
        this.store.dispatch(editJob({ data: result.formData }));
      }
    });
  }

  openDeleteDialog(row: any) {
    this.deleteDialog.openDelete(row.jobId, 'job').subscribe(result => {
      if (result?.data === 'yes') {
        this.store.dispatch(deletingJob({ jobId: row.jobId }));
      }
    });
  }
}
