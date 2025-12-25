import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { DeleteDialogService } from '../../../services/delete-dialog-service';
import {
  getBotsDataIsLoaded,
  getBotsDataIsLoading,
  getBotsDataResponse,
} from '../../../+state/db-config/db-config.selectors';
import { ColDef } from 'ag-grid-community';
import { setBotsData } from '../../../+state/db-config/db-config.actions';
import { AgGrid } from '../../../components/ag-grid/ag-grid';
import { HeaderContentLayout } from '../../../components/layouts/header-content-layout/header-content-layout';
import { TitleTableButton } from '../../../components/title-table-button/title-table-button';

@Component({
  selector: 'app-ag-grid-job-relations-container',
  imports: [
    AgGrid,
    HeaderContentLayout,
    TitleTableButton,
  ],
  templateUrl: './ag-grid-job-relations-container.html',
  styleUrl: './ag-grid-job-relations-container.scss',
})
export class AgGridJobRelationsContainer {
  private store = inject(Store);
  readonly deleteDialog = inject(DeleteDialogService);

  botsDataResponse$ = this.store.select(getBotsDataResponse);
  botsDataIsLoading$ = this.store.select(getBotsDataIsLoading);
  botsDataIsLoaded$ = this.store.select(getBotsDataIsLoaded);

  readonly colDefs: ColDef[] = [
    {
      field: "botName",
      headerName: 'Bot Name',
      flex: 1,
      filter: 'agTextColumnFilter',
      filterParams: {
        defaultToNothingSelected: true,
      },
    },
    {
      field: "botId",
      headerName: 'Bot ID',
      flex: 1,
      filter: 'agTextColumnFilter',
      filterParams: {
        defaultToNothingSelected: true,
      },
    },
  ];

  readonly defaultColDef: ColDef = {
    filter: true,
    sortable: true,
    cellStyle: { textAlign: 'center'},
    suppressMovable: true,
    headerClass: 'align-center',
  };

  constructor() {
    this.store.dispatch(setBotsData());
  }

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
