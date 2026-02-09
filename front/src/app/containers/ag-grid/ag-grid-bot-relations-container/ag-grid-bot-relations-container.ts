import { ChangeDetectionStrategy, Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { DeleteDialogService } from '../../../services/delete-dialog-service';
import { ColDef } from 'ag-grid-community';
import { AgGrid } from '../../../components/ag-grid/ag-grid';
import { HeaderContentLayout } from '../../../components/layouts/header-content-layout/header-content-layout';
import { TitleTableButton } from '../../../components/title-table-button/title-table-button';
import {
  getActiveBotIsLoaded,
  getActiveBotIsLoading,
  getBotRelation,
} from '../../../+state/relations/relations.selectors';
import { AsyncPipe } from '@angular/common';
import { Loader } from '../../../components/loader/loader';
import { getJobsDataIsLoaded, getJobsDataIsLoading } from '../../../+state/db-config/db-config.selectors';

@Component({
  selector: 'app-ag-grid-bot-relations-container',
  imports: [
    AgGrid,
    HeaderContentLayout,
    TitleTableButton,
    AsyncPipe,
    Loader,
  ],
  templateUrl: './ag-grid-bot-relations-container.html',
  styleUrl: './ag-grid-bot-relations-container.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AgGridBotRelationsContainer {
  @Input() currentBotId: number = 0;
  @Output() emitter = new EventEmitter();
  private store = inject(Store);
  readonly deleteDialog = inject(DeleteDialogService);

  jobsDataIsLoading$ = this.store.select(getJobsDataIsLoading);
  jobsDataIsLoaded$ = this.store.select(getJobsDataIsLoaded);
  activeBotIsLoading$ = this.store.select(getActiveBotIsLoading);
  activeBotIsLoaded$ = this.store.select(getActiveBotIsLoaded);

  botRelation$ = this.store.select(getBotRelation);

  readonly colDefs: ColDef[] = [
    {
      headerName: 'Job Id',
      flex: 1,
      filter: 'agTextColumnFilter',
      filterParams: {
        defaultToNothingSelected: true,
      },
      valueGetter: (params) => {
        return params.data?.jobId || '-';
      },
    },
    {
      headerName: 'Job Type',
      flex: 1,
      filter: 'agTextColumnFilter',
      filterParams: {
        defaultToNothingSelected: true,
      },
      valueGetter: (params) => {
        return params.data?.jobType || '-';
      },
    },
    {
      headerName: 'Chain Id',
      flex: 1,
      valueGetter: (params) => {
        return params.data?.chainId || '-';
      },
    },
    {
      headerName: 'Rpc Url',
      flex: 1,
      valueGetter: (params) => {
        return params.data?.rpcUrlId || '-';
      },
    },
    {
      field: "pairsCount",
      headerName: 'Pairs count',
      flex: 1,
    },
  ];

  readonly defaultColDef: ColDef = {
    filter: true,
    sortable: true,
    cellStyle: { textAlign: 'center', userSelect: 'text'},
    suppressMovable: true,
    headerClass: 'align-center',
  };

  events($event: any) {
    this.emitter.emit({
      event: 'AgGridBotRelationsContainer:ACTIVE_RELATIONS',
      data: $event.row.selectedNodes.map((item: any) => item.data.jobId),
      fullData: $event.row.selectedNodes.map((item: any) => item.data),
    });
  }
}
