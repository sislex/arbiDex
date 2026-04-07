import { Component, inject, OnInit } from '@angular/core';
import { AgGrid } from '../../../components/ag-grid/ag-grid';
import { HeaderContentLayout } from '../../../components/layouts/header-content-layout/header-content-layout';
import { TitleTableButton } from '../../../components/title-table-button/title-table-button';
import { ColDef } from 'ag-grid-community';
import { DeleteDialogService } from '../../../services/delete-dialog-service';
import { Store } from '@ngrx/store';
import {
  getCexFullJobsDataIsReady,
  getCexJobsFullDataResponse,
} from '../../../+state/db-config/db-config.selectors';
import {
  createCexJob,
  deletingCexJob,
  editCexJob,
  initCexJobsListPage,
} from '../../../+state/db-config/db-config.actions';
import { Loader } from '../../../components/loader/loader';
import { AsyncPipe } from '@angular/common';
import { Router } from '@angular/router';
import {CexJobDialogService} from '../../../services/cex-job-form-dialog-service';
import {ActionsContainerCexJob} from '../../actions-container-cex-job/actions-container-cex-job';

@Component({
  selector: 'app-ag-grid-cex-jobs-container',
  imports: [
    AgGrid,
    HeaderContentLayout,
    TitleTableButton,
    Loader,
    AsyncPipe,
  ],
  templateUrl: './ag-grid-cex-jobs-container.html',
  styleUrl: './ag-grid-cex-jobs-container.scss',
})
export class AgGridCexJobsContainer implements OnInit {
  private store = inject(Store);
  readonly deleteDialog = inject(DeleteDialogService);
  readonly jobDialog = inject(CexJobDialogService);
  readonly router = inject(Router);

  getCexJobsFullDataResponse$ = this.store.select(getCexJobsFullDataResponse);
  fullCexJobsDataIsReady$ = this.store.select(getCexFullJobsDataIsReady);
  filteredItemCount: number = 0;

  readonly colDefs: ColDef[] = [
    {
      headerName: 'Actions',
      cellRenderer: ActionsContainerCexJob,
      width: 160,
      cellRendererParams: {
        onAction: this.onAction.bind(this),
      },
    },
    {
      field: "id",
      headerName: 'Job ID',
      flex: 1,
      filter: true,
      sortable: true,
    },
    {
      field: "job_type",
      headerName: 'Job Type',
      flex: 1,
      filter: true,
      sortable: true,
    },
    {
      field: "description",
      headerName: 'Description',
      flex: 1,
      filter: true,
      sortable: true,
    },
    {
      headerName: 'Source',
      flex: 1,
      filter: true,
      sortable: true,
      valueGetter: (params) => {
        return params.data?.chainName || '-';
      },
    },
    {
      headerName: 'Token 0',
      flex: 1,
      filter: true,
      sortable: true,
      valueGetter: (params) => {
        return params.data?.token0 || '-';
      },
    },
    {
      headerName: 'Token 1',
      flex: 1,
      filter: true,
      sortable: true,
      valueGetter: (params) => {
        return params.data?.token1 || '-';
      },
    },
  ];

  readonly defaultColDef: ColDef = {
    sortable: false,
    suppressMovable: true,
    headerClass: 'align-center',
    minWidth: 110,
    cellStyle: {
      textAlign: 'center',
      cursor: 'pointer',
      userSelect: 'text'
    },
  };

  ngOnInit() {
    this.store.dispatch(initCexJobsListPage());
    this.store.select(getCexJobsFullDataResponse).subscribe(data => {
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

  actions($event: any, note?: any) {
    if ($event.event === 'Actions:ACTION_CLICKED') {
      if (note === 'add') {
        this.openCreateDialog();
      }
    }
    if ($event.event === 'AgGrid:MODEL_UPDATED') {
      this.filteredItemCount = $event.rowsDisplayed;
    }
  }

  openCreateDialog() {
    this.jobDialog.openCreate().subscribe(result => {
      if (result?.data === 'add') {
        this.store.dispatch(createCexJob({ data: result.formData }));
      }
    });
  }

  openEditDialog(row: any) {
    this.jobDialog.openEdit(row).subscribe(result => {
      if (result?.data === 'save') {
        this.store.dispatch(editCexJob({ data: result.formData }));
      }
    });
  }

  openDeleteDialog(row: any) {
    this.deleteDialog.openDelete(row.jobId, 'job').subscribe(result => {
      if (result?.data === 'yes') {
        this.store.dispatch(deletingCexJob({ cexJobId: row.id }));
      }
    });
  }
}
