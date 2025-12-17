import { Component, inject, OnInit } from '@angular/core';
import {ColDef} from 'ag-grid-community';
import {AgGrid} from '../../../components/ag-grid/ag-grid';
import { HeaderContentLayout } from '../../../components/layouts/header-content-layout/header-content-layout';
import { TitleTableButton } from '../../../components/title-table-button/title-table-button';
import { Store } from '@ngrx/store';
import { DexDialogService } from '../../../services/dex-dialog-service';
import {
  getDexesDataIsLoaded,
  getDexesDataIsLoading,
  getDexesDataResponse,
} from '../../../+state/db-config/db-config.selectors';
import { AsyncPipe } from '@angular/common';
import { Loader } from '../../../components/loader/loader';
import { createDex, setDexesData } from '../../../+state/db-config/db-config.actions';
import { ActionsContainer } from '../../actions-container/actions-container';

@Component({
  selector: 'app-ag-grid-dexes-container',
  imports: [
    AgGrid,
    HeaderContentLayout,
    TitleTableButton,
    AsyncPipe,
    Loader,
  ],
  templateUrl: './ag-grid-dexes-container.html',
  styleUrl: './ag-grid-dexes-container.scss',
})
export class AgGridDexesContainer implements OnInit {
  private store = inject(Store);
  readonly dexDialog = inject(DexDialogService);

  list$: any;
  dexesDataResponse$ = this.store.select(getDexesDataResponse);
  dexesDataIsLoading$ = this.store.select(getDexesDataIsLoading);
  dexesDataIsLoaded$ = this.store.select(getDexesDataIsLoaded);


  colDefs: ColDef[] = [
    {
      field: "#",
      headerName: '#',
      width: 50,
      valueGetter: params => {
        if (!params.node || params.node.rowIndex == null) return '';
        return params.node.rowIndex + 1;
      },
    },
    {
      field: "dexId",
      headerName: 'ID',
      flex: 1,
    },
    {
      field: "name",
      headerName: 'Name',
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

  defaultColDef: ColDef = {
    sortable: false,
    cellStyle: { textAlign: 'center'},
    suppressMovable: true,
    headerClass: 'align-center',
  };

  ngOnInit() {
    this.store.dispatch(setDexesData());
  };

  onAction() {

  };

  actions($event: any, note: any) {
    if (note === 'add' ) {
      this.openCreateDialog();
    }
  }

  openCreateDialog() {
    this.dexDialog.openCreate(this.list$).subscribe(result => {
      if (result?.data === 'add') {
        this.store.dispatch(createDex({ data: result.formData }));
      }
    });
  }
}
