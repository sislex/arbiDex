import { Component, inject } from '@angular/core';
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
  getBotsDataIsLoaded,
  getBotsDataIsLoading,
  getBotsDataResponse,
} from '../../../+state/db-config/db-config.selectors';
import { createBot, deletingBot, editBot, setBotsData } from '../../../+state/db-config/db-config.actions';
import { BotDialogService } from '../../../services/bot-dialog-service';

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
export class AgGridBotsContainer {
  private store = inject(Store);
  readonly deleteDialog = inject(DeleteDialogService);
  readonly botDialog = inject(BotDialogService);

  botsDataResponse$ = this.store.select(getBotsDataResponse);
  botsDataIsLoading$ = this.store.select(getBotsDataIsLoading);
  botsDataIsLoaded$ = this.store.select(getBotsDataIsLoaded);

  readonly colDefs: ColDef[] = [
    {
      field: "botId",
      headerName: 'Bot ID',
      flex: 1,
    },
    {
      field: "botName",
      headerName: 'Bot Name',
      flex: 1,
    },
    {
      field: "description",
      headerName: 'Description',
      flex: 1,
    },
    {
      headerName: 'Server',
      flex: 1,
      valueGetter: (params) => {
        return params.data?.server?.serverId || '-';
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
      this.store.dispatch(setBotsData());
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

  actions($event: any, note: any) {
    if (note === 'add' ) {
      this.openCreateDialog();
    }
  }

  openCreateDialog() {
    this.botDialog.openCreate().subscribe(result => {
      if (result?.data === 'add') {
        this.store.dispatch(createBot({ data: result.formData }));
      }
    });
  }

  openEditDialog(row: any) {
      this.botDialog.openEdit(row).subscribe(result => {
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
