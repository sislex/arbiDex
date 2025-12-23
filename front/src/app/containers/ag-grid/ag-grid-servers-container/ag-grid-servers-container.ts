import { Component, inject } from '@angular/core';
import { AgGrid } from '../../../components/ag-grid/ag-grid';
import { HeaderContentLayout } from '../../../components/layouts/header-content-layout/header-content-layout';
import { TitleTableButton } from '../../../components/title-table-button/title-table-button';
import { ColDef } from 'ag-grid-community';
import { DeleteDialogService } from '../../../services/delete-dialog-service';
import { Store } from '@ngrx/store';
import { ActionsContainer } from '../../actions-container/actions-container';

@Component({
  selector: 'app-ag-grid-servers-container',
  imports: [
    AgGrid,
    HeaderContentLayout,
    TitleTableButton,
  ],
  templateUrl: './ag-grid-servers-container.html',
  styleUrl: './ag-grid-servers-container.scss',
})
export class AgGridServersContainer {
  private store = inject(Store);
  readonly deleteDialog = inject(DeleteDialogService);

  // chainsDataResponse$ = this.store.select(getChainsDataResponse);
  // chainsDataIsLoading$ = this.store.select(getChainsDataIsLoading);
  // chainsDataIsLoaded$ = this.store.select(getChainsDataIsLoaded);

  readonly colDefs: ColDef[] = [
      {
        field: "serverId",
        headerName: 'Server ID',
        flex: 1,
      },
      {
        field: "ip",
        headerName: 'IP',
        flex: 1,
      },
      {
        field: "port",
        headerName: 'Port',
        flex: 1,
      },
      {
        field: "serverName",
        headerName: 'Server Name',
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

  readonly defaultColDef: ColDef = {
      sortable: false,
      cellStyle: { textAlign: 'center'},
      suppressMovable: true,
      headerClass: 'align-center',
  };


  constructor() {
    //   this.store.dispatch(setChainsData());
  }

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
    //   this.chainDialog.openCreate().subscribe(result => {
    //     if (result?.data === 'add') {
    //       this.store.dispatch(createChain({ data: result.formData }));
    //     }
    //   });
  }

  openEditDialog(row: any) {
  //   this.chainDialog.openEdit(row).subscribe(result => {
  //     if (result?.data === 'save') {
  //       this.store.dispatch(editChain({ data: result.formData }));
  //     }
  //   });
  }

  openDeleteDialog(row: any) {
    this.deleteDialog.openDelete(row.name, 'chain').subscribe(result => {
      if (result?.data === 'yes') {
        // this.store.dispatch(deletingChain({ chainId: row.chainId }));
      }
    });
  }
}
