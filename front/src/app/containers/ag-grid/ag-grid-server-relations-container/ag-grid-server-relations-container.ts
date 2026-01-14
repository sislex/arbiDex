import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Loader } from '../../../components/loader/loader';
import { TitleTableButton } from '../../../components/title-table-button/title-table-button';
import { HeaderContentLayout } from '../../../components/layouts/header-content-layout/header-content-layout';
import { AgGrid } from '../../../components/ag-grid/ag-grid';
import { Store } from '@ngrx/store';
import { DeleteDialogService } from '../../../services/delete-dialog-service';
import { ColDef } from 'ag-grid-community';
import { AsyncPipe } from '@angular/common';
import {
  getBotsByServerIdIsLoaded,
  getBotsByServerIdIsLoading,
  getBotsByServerIdResponse,
} from '../../../+state/db-config/db-config.selectors';
import {
  getActiveServerIsLoaded,
  getActiveServerIsLoading,
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

  botsDataIsLoading$ = this.store.select(getBotsByServerIdIsLoading);
  botsDataIsLoaded$ = this.store.select(getBotsByServerIdIsLoaded);
  activeServerIsLoading$ = this.store.select(getActiveServerIsLoading);
  activeServerIsLoaded$ = this.store.select(getActiveServerIsLoaded);

  serverRelation$ = this.store.select(getBotsByServerIdResponse);

  readonly colDefs: ColDef[] = [
    {
      headerName: 'Bot Name',
      flex: 1,
      filter: 'agTextColumnFilter',
      filterParams: {
        defaultToNothingSelected: true,
      },
      valueGetter: (params) => {
        return params.data?.botName || '-';
      },
    },
    {
      headerName: 'Chain Id',
      flex: 1,
      filter: 'agTextColumnFilter',
      filterParams: {
        defaultToNothingSelected: true,
      },
      valueGetter: (params) => {
        return params.data?.job?.chain?.chainId || '-';
      },
    },
    {
      headerName: 'Job Name',
      flex: 1,
      filter: 'agTextColumnFilter',
      filterParams: {
        defaultToNothingSelected: true,
      },
      valueGetter: (params) => {
        return params.data?.job?.jobType || '-';
      },
    },
    {
      headerName: 'Pairs count',
      flex: 1,
      filter: 'agTextColumnFilter',
      filterParams: {
        defaultToNothingSelected: true,
      },
      valueGetter: (params) => {
        return params.data?.job?.quoteJobRelations.length || '-';
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
      event: 'AgGridServerRelationsContainer:ACTIVE_RELATIONS',
      data: $event.row.selectedNodes.map((item: any) => item.data.botId),
      fullData: $event.row.selectedNodes.map((item: any) => item.data),
    });
  }
}
