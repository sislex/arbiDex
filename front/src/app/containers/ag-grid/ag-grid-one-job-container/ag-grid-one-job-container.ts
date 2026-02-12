import {Component, EventEmitter, inject, Input, Output} from '@angular/core';
import {AgGrid} from "../../../components/ag-grid/ag-grid";
import {AsyncPipe} from "@angular/common";
import {HeaderContentLayout} from "../../../components/layouts/header-content-layout/header-content-layout";
import {TitleTableButton} from "../../../components/title-table-button/title-table-button";
import {Store} from '@ngrx/store';
import {getJobFullDataResponse} from '../../../+state/db-config/db-config.selectors';
import {ColDef} from 'ag-grid-community';

@Component({
  selector: 'app-ag-grid-one-job-container',
    imports: [
        AgGrid,
        AsyncPipe,
        HeaderContentLayout,
        TitleTableButton
    ],
  templateUrl: './ag-grid-one-job-container.html',
  styleUrl: './ag-grid-one-job-container.scss',
})
export class AgGridOneJobContainer {
  @Input() currentJobId: number = 0;
  @Output() emitter = new EventEmitter();
  private store = inject(Store);

  jobFullDataResponse$ = this.store.select(getJobFullDataResponse);

  readonly colDefs: ColDef[] = [
    {
      field: "jobId",
      headerName: 'Job ID',
      flex: 1,
      filter: true,
      sortable: true,
    },
    {
      field: "jobType",
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
      headerName: 'Chain',
      flex: 1,
      filter: true,
      sortable: true,
      valueGetter: (params) => {
        return params.data?.chainName || '-';
      },
    },
    {
      headerName: 'Rpc Url',
      flex: 1,
      filter: true,
      sortable: true,
      valueGetter: (params) => {
        return params.data?.rpcUrl || '-';
      },
    },
    {
      field: "pairsCount",
      headerName: 'Pairs count',
      flex: 1,
      filter: true,
      sortable: true,
    },
    {
      headerName: 'Additional data',
      flex: 1,
      filter: true,
      sortable: true,
      valueGetter: (params) => {
        return params.data?.extraSettings || '-';
      },
    },
  ];

  readonly defaultColDef: ColDef = {
    headerClass: 'align-center',
    cellStyle: {
      textAlign: 'center',
      cursor: 'pointer',
      userSelect: 'text'
    },
  };

}
