import { Component, inject, OnInit } from '@angular/core';
import { AgGrid } from '../../../components/ag-grid/ag-grid';
import { HeaderContentLayout } from '../../../components/layouts/header-content-layout/header-content-layout';
import { TitleTableButton } from '../../../components/title-table-button/title-table-button';
import { Loader } from '../../../components/loader/loader';
import { AsyncPipe } from '@angular/common';
import { ColDef } from 'ag-grid-community';
import { DeleteDialogService } from '../../../services/delete-dialog-service';
import { Store } from '@ngrx/store';
import { ActionsContainer } from '../../actions-container/actions-container';
import {
  getFullBotsDataIsReady,
  getFullBotsDataResponse,
  getJobsDataResponse,
  getServersDataResponse,
} from '../../../+state/db-config/db-config.selectors';
import {
  createBot,
  deletingBot,
  editBot,
  initBotsListPage,
} from '../../../+state/db-config/db-config.actions';
import { BotDialogService } from '../../../services/bot-dialog-service';
import { map } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ag-grid-bots-container',
  imports: [
    AgGrid,
    HeaderContentLayout,
    TitleTableButton,
    Loader,
    AsyncPipe,
  ],
  templateUrl: './ag-grid-bots-container.html',
  styleUrl: './ag-grid-bots-container.scss',
})
export class AgGridBotsContainer implements OnInit {
  private store = inject(Store);
  readonly deleteDialog = inject(DeleteDialogService);
  readonly botDialog = inject(BotDialogService);
  readonly router = inject(Router);

  fullBotsDataResponse$ = this.store.select(getFullBotsDataResponse);
  fullBotsDataIsReady$ = this.store.select(getFullBotsDataIsReady);
  filteredItemCount: number = 0;

  serversList$ = this.store.select(getServersDataResponse).pipe(
    map(item =>
      item.map(item => ({
        id: item.serverId,
        name: item.serverName,
      }))
    )
  );

  jobList$ = this.store.select(getJobsDataResponse).pipe(
    map(item =>
      item.map(item => ({
        id: item.jobId,
        name: item.jobType,
        address: item.description.toString(),
      }))
    )
  );

  readonly colDefs: ColDef[] = [
    {
      headerName: 'Actions',
      width: 125,
      cellRenderer: ActionsContainer,
      cellRendererParams: {
        onAction: this.onAction.bind(this),
      },
    },
    {
      field: "botId",
      headerName: 'Bot ID',
      flex: 1,
      filter: true,
      sortable: true,
    },
    {
      field: "botName",
      headerName: 'Bot Name',
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
      headerName: 'Job',
      flex: 1,
      filter: true,
      sortable: true,
      valueGetter: (params) => {
        return params.data?.jobType || '-';
      },
    },
    {
      headerName: 'Server',
      flex: 1,
      filter: true,
      sortable: true,
      valueGetter: (params) => {
        return params.data?.serverName || '-';
      },
    },
    {
      headerName: 'Pairs count',
      flex: 1,
      filter: true,
      sortable: true,
      valueGetter: (params) => {
        return params.data?.pairsCount || '-';
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
    this.store.dispatch(initBotsListPage());
    this.store.select(getFullBotsDataResponse).subscribe(data => {
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
    } else if ($event.event === 'AgGrid:DOUBLE_CLICKED_ROW') {
      this.router.navigate([`/data-view/bots/${$event.row.data.botId}`]);
    }

    if ($event.event === 'AgGrid:MODEL_UPDATED') {
      this.filteredItemCount = $event.rowsDisplayed;
    }
  }

  openCreateDialog() {
    this.botDialog.openCreate(this.serversList$, this.jobList$).subscribe(result => {
      if (result?.data === 'add') {
        this.store.dispatch(createBot({ data: result.formData }));
      }
    });
  }

  openEditDialog(row: any) {
    this.botDialog.openEdit(row, this.serversList$, this.jobList$).subscribe(result => {
      if (result?.data === 'save') {
        this.store.dispatch(editBot({ data: result.formData }));
      }
    });
  }

  openDeleteDialog(row: any) {
    this.deleteDialog.openDelete(row.botId, 'bot').subscribe(result => {
      if (result?.data === 'yes') {
        this.store.dispatch(deletingBot({ botId: row.botId }));
      }
    });
  }
}
