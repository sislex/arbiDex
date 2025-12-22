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
import { createDex, deletingDex, editDex, setDexesData } from '../../../+state/db-config/db-config.actions';
import { ActionsContainer } from '../../actions-container/actions-container';
import { DeleteDialogService } from '../../../services/delete-dialog-service';

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
  readonly deleteDialog = inject(DeleteDialogService);

  list$: any;
  dexesDataResponse$ = this.store.select(getDexesDataResponse);
  dexesDataIsLoading$ = this.store.select(getDexesDataIsLoading);
  dexesDataIsLoaded$ = this.store.select(getDexesDataIsLoaded);


  colDefs: ColDef[] = [
    {
      field: "dexId",
      headerName: 'Dex ID',
      flex: 1,
    },
    {
      field: "name",
      headerName: 'Dex Name',
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
    this.dexDialog.openCreate(this.list$).subscribe(result => {
      if (result?.data === 'add') {
        this.store.dispatch(createDex({ data: result.formData }));
      }
    });
  }

  openEditDialog(row: any) {
    this.dexDialog.openEdit(row, this.list$).subscribe(result => {
      if (result?.data === 'save') {
        this.store.dispatch(editDex({ data: result.formData }));
      }
    });
  }

  openDeleteDialog(row: any) {
    this.deleteDialog.openDelete(row.name, 'dex').subscribe(result => {
      if (result?.data === 'yes') {
        this.store.dispatch(deletingDex({ dexId: row.dexId }));
      }
    });
  }
}
