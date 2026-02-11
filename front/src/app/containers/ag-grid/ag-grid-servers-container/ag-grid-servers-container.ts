import {Component, inject, OnInit} from '@angular/core';
import { AgGrid } from '../../../components/ag-grid/ag-grid';
import { HeaderContentLayout } from '../../../components/layouts/header-content-layout/header-content-layout';
import { TitleTableButton } from '../../../components/title-table-button/title-table-button';
import { ColDef } from 'ag-grid-community';
import { DeleteDialogService } from '../../../services/delete-dialog-service';
import { Store } from '@ngrx/store';
import { ActionsContainer } from '../../actions-container/actions-container';
import {
  getServersDataIsLoaded,
  getServersDataIsLoading,
  getServersDataResponse,
} from '../../../+state/db-config/db-config.selectors';
import { createServer, deletingServer, editServer, setServersData } from '../../../+state/db-config/db-config.actions';
import { AsyncPipe } from '@angular/common';
import { Loader } from '../../../components/loader/loader';
import { ServerDialogService } from '../../../services/server-dialog-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ag-grid-servers-container',
  imports: [
    AgGrid,
    HeaderContentLayout,
    TitleTableButton,
    AsyncPipe,
    Loader,
  ],
  templateUrl: './ag-grid-servers-container.html',
  styleUrl: './ag-grid-servers-container.scss',
})
export class AgGridServersContainer implements OnInit {
  private store = inject(Store);
  readonly deleteDialog = inject(DeleteDialogService);
  readonly serverDialog = inject(ServerDialogService);
  readonly router = inject(Router);

  serversDataResponse$ = this.store.select(getServersDataResponse);
  serversDataIsLoading$ = this.store.select(getServersDataIsLoading);
  serversDataIsLoaded$ = this.store.select(getServersDataIsLoaded);
  filteredItemCount: number = 0;

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
      field: "serverId",
      headerName: 'Server ID',
      flex: 1,
      filter: true,
      sortable: true,
    },
    {
      field: "ip",
      headerName: 'IP',
      flex: 1,
      filter: true,
      sortable: true,
    },
    {
      field: "port",
      headerName: 'Port',
      flex: 1,
      filter: true,
      sortable: true,
    },
    {
      field: "serverName",
      headerName: 'Server Name',
      flex: 1,
      filter: true,
      sortable: true,
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
    this.store.dispatch(setServersData());
    this.store.select(getServersDataResponse).subscribe(data => {
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
      this.router.navigate([`/data-view/servers/${$event.row.data.serverId}`]);
    }

    if ($event.event === 'AgGrid:MODEL_UPDATED') {
      this.filteredItemCount = $event.rowsDisplayed;
    }
  }

  openCreateDialog() {
    this.serverDialog.openCreate().subscribe(result => {
      if (result?.data === 'add') {
        this.store.dispatch(createServer({ data: result.formData }));
      }
    });
  }

  openEditDialog(row: any) {
    this.serverDialog.openEdit(row).subscribe(result => {
      if (result?.data === 'save') {
        this.store.dispatch(editServer({ data: result.formData }));
      }
    });
  }

  openDeleteDialog(row: any) {
    this.deleteDialog.openDelete(row.serverName, 'server').subscribe(result => {
      if (result?.data === 'yes') {
        this.store.dispatch(deletingServer({ serverId: row.serverId }));
      }
    });
  }
}
