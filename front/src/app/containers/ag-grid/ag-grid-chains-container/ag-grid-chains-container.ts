import { Component, inject } from '@angular/core';
import {ColDef} from 'ag-grid-community';
import {AgGrid} from '../../../components/ag-grid/ag-grid';
import { HeaderContentLayout } from '../../../components/layouts/header-content-layout/header-content-layout';
import { TitleTableButton } from '../../../components/title-table-button/title-table-button';
import { Store } from '@ngrx/store';
import { ChainDialogService } from '../../../services/chain-dialog-service';

@Component({
  selector: 'app-ag-grid-chains-container',
  imports: [
    AgGrid,
    HeaderContentLayout,
    TitleTableButton,
  ],
  templateUrl: './ag-grid-chains-container.html',
  styleUrl: './ag-grid-chains-container.scss',
})
export class AgGridChainsContainer {
  private store = inject(Store);
  readonly chainDialog = inject(ChainDialogService);

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
      field: "chain_id",
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
    // this.chainDialog.openCreate(this.list$).subscribe(result => {
    //   if (result?.data === 'add') {
    //     this.store.dispatch(createChain({ data: result.formData }));
    //   }
    // });
  }
}
