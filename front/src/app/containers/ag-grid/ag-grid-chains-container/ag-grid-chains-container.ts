import {Component, inject, OnInit} from '@angular/core';
import {ColDef} from 'ag-grid-community';
import {AgGrid} from '../../../components/ag-grid/ag-grid';
import { HeaderContentLayout } from '../../../components/layouts/header-content-layout/header-content-layout';
import { TitleTableButton } from '../../../components/title-table-button/title-table-button';
import { Store } from '@ngrx/store';
import { ChainDialogService } from '../../../services/chain-dialog-service';
import {
  createChain,
  deletingChain,
  editChain,
  setChainsData,
} from '../../../+state/db-config/db-config.actions';
import { ActionsContainer } from '../../actions-container/actions-container';
import { Loader } from '../../../components/loader/loader';
import {
  getChainsDataIsLoaded,
  getChainsDataIsLoading,
  getChainsDataResponse,
} from '../../../+state/db-config/db-config.selectors';
import { AsyncPipe } from '@angular/common';
import { DeleteDialogService } from '../../../services/delete-dialog-service';

@Component({
  selector: 'app-ag-grid-chains-container',
  imports: [
    AgGrid,
    HeaderContentLayout,
    TitleTableButton,
    Loader,
    AsyncPipe,
  ],
  templateUrl: './ag-grid-chains-container.html',
  styleUrl: './ag-grid-chains-container.scss',
})
export class AgGridChainsContainer implements OnInit {
  private store = inject(Store);
  readonly chainDialog = inject(ChainDialogService);
  readonly deleteDialog = inject(DeleteDialogService);

  chainsDataResponse$ = this.store.select(getChainsDataResponse);
  chainsDataIsLoading$ = this.store.select(getChainsDataIsLoading);
  chainsDataIsLoaded$ = this.store.select(getChainsDataIsLoaded);
  filteredItemCount: number = 0;

  readonly colDefs: ColDef[] = [
    {
      field: "chainId",
      headerName: 'Chain ID',
      flex: 1,
    },
    {
      field: "name",
      headerName: 'Chain Name',
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
    cellStyle: { textAlign: 'center', userSelect: 'text'},
    suppressMovable: true,
    headerClass: 'align-center',
  };
  ngOnInit() {
    this.store.dispatch(setChainsData());
    this.store.select(getChainsDataResponse).subscribe(data => {
      this.filteredItemCount = data?.length || 0;
    });
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
    this.chainDialog.openCreate().subscribe(result => {
      if (result?.data === 'add') {
        this.store.dispatch(createChain({ data: result.formData }));
      }
    });
  }

  openEditDialog(row: any) {
    this.chainDialog.openEdit(row).subscribe(result => {
      if (result?.data === 'save') {
        this.store.dispatch(editChain({ data: result.formData }));
      }
    });
  }

  openDeleteDialog(row: any) {
    this.deleteDialog.openDelete(row.name, 'chain').subscribe(result => {
      if (result?.data === 'yes') {
        this.store.dispatch(deletingChain({ chainId: row.chainId }));
      }
    });
  }

  events($event: any) {
    if ($event.event === 'AgGrid:MODEL_UPDATED') {
      this.filteredItemCount = $event.rowsDisplayed;
    }
  }
}
