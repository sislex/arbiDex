import { Component, inject } from '@angular/core';
import {ColDef} from 'ag-grid-community';
import {AgGrid} from '../../../components/ag-grid/ag-grid';
import { HeaderContentLayout } from '../../../components/layouts/header-content-layout/header-content-layout';
import { TitleTableButton } from '../../../components/title-table-button/title-table-button';
import { Store } from '@ngrx/store';
import { DexDialogService } from '../../../services/dex-dialog-service';

@Component({
  selector: 'app-ag-grid-dexes-container',
  imports: [
    AgGrid,
    HeaderContentLayout,
    TitleTableButton,
  ],
  templateUrl: './ag-grid-dexes-container.html',
  styleUrl: './ag-grid-dexes-container.scss',
})
export class AgGridDexesContainer {
  private store = inject(Store);
  readonly dexDialog = inject(DexDialogService);

  list$: any;

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
      field: "dexes_id",
      headerName: 'ID',
    },
    {
      field: "name",
      headerName: 'Name',
    },
  ];

  defaultColDef: ColDef = {
    sortable: false,
    cellStyle: { textAlign: 'center'},
    suppressMovable: true,
    headerClass: 'align-center',
    flex: 1
  };

  actions($event: any, note: any) {
    if (note === 'add' ) {
      this.openCreateDialog();
    }
  }

  openCreateDialog() {
    this.dexDialog.openCreate(this.list$).subscribe(result => {
      if (result?.data === 'add') {
        // this.store.dispatch(createDex({ data: result.formData }));
      }
    });
  }
}
