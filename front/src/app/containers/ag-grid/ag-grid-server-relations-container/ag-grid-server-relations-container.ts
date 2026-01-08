import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Loader } from '../../../components/loader/loader';
import { TitleTableButton } from '../../../components/title-table-button/title-table-button';
import { HeaderContentLayout } from '../../../components/layouts/header-content-layout/header-content-layout';
import { AgGrid } from '../../../components/ag-grid/ag-grid';
import { Store } from '@ngrx/store';
import { DeleteDialogService } from '../../../services/delete-dialog-service';
import { ColDef } from 'ag-grid-community';
import { AsyncPipe } from '@angular/common';
import { getBotsDataIsLoaded, getBotsDataIsLoading } from '../../../+state/db-config/db-config.selectors';
import {
  getActiveServerIsLoaded,
  getActiveServerIsLoading,
  getServerRelation,
} from '../../../+state/relations/relations.selectors';

@Component({
  selector: 'app-ag-grid-server-relations-container',
  imports: [
    Loader,
    TitleTableButton,
    HeaderContentLayout,
    AgGrid,
    AsyncPipe,
  ],
  templateUrl: './ag-grid-server-relations-container.html',
  styleUrl: './ag-grid-server-relations-container.scss',
})
export class AgGridServerRelationsContainer {
  @Input() currentServerId: any;
  @Output() emitter = new EventEmitter();
  private store = inject(Store);
  readonly deleteDialog = inject(DeleteDialogService);

  botsDataIsLoading$ = this.store.select(getBotsDataIsLoading);
  botsDataIsLoaded$ = this.store.select(getBotsDataIsLoaded);
  activeServerIsLoading$ = this.store.select(getActiveServerIsLoading);
  activeServerIsLoaded$ = this.store.select(getActiveServerIsLoaded);

  serverRelation$ = this.store.select(getServerRelation);

  readonly colDefs: ColDef[] = [
    {
      // field: "botName",
      headerName: 'Bot Name',
      width: 150,
      filter: 'agTextColumnFilter',
      filterParams: {
        defaultToNothingSelected: true,
      },
      valueGetter: (params) => {
        return params.data?.botName || '-';
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

  events($event: any) {
    this.emitter.emit({
      event: 'AgGridJobRelationsContainer:ACTIVE_RELATIONS',
      // data: $event.row.selectedNodes.map((item: any) => item.data.pairQuoteRelationId),
      // fullData: $event.row.selectedNodes.map((item: any) => item.data),
    });
  }
}
