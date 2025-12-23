import { Component, inject, OnInit } from '@angular/core';
import { AgGrid } from '../../../components/ag-grid/ag-grid';
import { HeaderContentLayout } from '../../../components/layouts/header-content-layout/header-content-layout';
import { TitleTableButton } from '../../../components/title-table-button/title-table-button';
import { ColDef } from 'ag-grid-community';
import { DeleteDialogService } from '../../../services/delete-dialog-service';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-ag-grid-pairs-container',
  imports: [
    AgGrid,
    HeaderContentLayout,
    TitleTableButton,
  ],
  templateUrl: './ag-grid-pairs-container.html',
  styleUrl: './ag-grid-pairs-container.scss',
})
export class AgGridPairsContainer  implements OnInit {
  private store = inject(Store);
  readonly deleteDialog = inject(DeleteDialogService);

  // chainsDataResponse$ = this.store.select(getChainsDataResponse);
  // chainsDataIsLoading$ = this.store.select(getChainsDataIsLoading);
  // chainsDataIsLoaded$ = this.store.select(getChainsDataIsLoaded);
  //
  colDefs: ColDef[] = [
    //   {
    //     field: "chainId",
    //     headerName: 'Chain ID',
    //     flex: 1,
    //   },
    //   {
    //     field: "name",
    //     headerName: 'Chain Name',
    //     flex: 1,
    //   },
    //   {
    //     headerName: 'Actions',
    //     width: 125,
    //     cellRenderer: ActionsContainer,
    //     cellRendererParams: {
    //       onAction: this.onAction.bind(this),
    //     },
    //   },
  ];

  defaultColDef: ColDef = {
    //   sortable: false,
    //   cellStyle: { textAlign: 'center'},
    //   suppressMovable: true,
    //   headerClass: 'align-center',
  };

  ngOnInit() {
    //   this.store.dispatch(setChainsData());
  };
  //
  // onAction($event: any, row: any) {
  //   if ($event.event === 'Actions:ACTION_CLICKED') {
  //     if ($event.actionType === 'delete') {
  //       this.openDeleteDialog(row);
  //     } else if ($event.actionType === 'edit') {
  //       this.openEditDialog(row);
  //     }
  //   }
  // }

  actions($event: any, note: any) {
    if (note === 'add' ) {
      this.openCreateDialog();
    }
  }

  openCreateDialog() {
    //   this.chainDialog.openCreate().subscribe(result => {
    //     if (result?.data === 'add') {
    //       this.store.dispatch(createChain({ data: result.formData }));
    //     }
    //   });
  }

  // openEditDialog(row: any) {
  //   this.chainDialog.openEdit(row).subscribe(result => {
  //     if (result?.data === 'save') {
  //       this.store.dispatch(editChain({ data: result.formData }));
  //     }
  //   });
  // }
  //
  openDeleteDialog(row: any) {
    this.deleteDialog.openDelete(row.name, 'chain').subscribe(result => {
      if (result?.data === 'yes') {
        // this.store.dispatch(deletingChain({ chainId: row.chainId }));
      }
    });
  }
}
