import {Component, inject, OnInit} from '@angular/core';
import {ColDef} from 'ag-grid-community';
import {AgGrid} from '../../../components/ag-grid/ag-grid';
import { HeaderContentLayout } from '../../../components/layouts/header-content-layout/header-content-layout';
import { TitleTableButton } from '../../../components/title-table-button/title-table-button';
import { Store } from '@ngrx/store';
import {
  createCexChain,
  deletingCexChain,
  editCexChain,
  setCexChainsData,
} from '../../../+state/db-config/db-config.actions';
import { ActionsContainer } from '../../actions-container/actions-container';
import { Loader } from '../../../components/loader/loader';
import {
  getCexChainsDataIsLoaded,
  getCexChainsDataIsLoading,
  getCexChainsDataResponse,
} from '../../../+state/db-config/db-config.selectors';
import { AsyncPipe } from '@angular/common';
import { DeleteDialogService } from '../../../services/delete-dialog-service';
import {CexChainDialogService} from '../../../services/cex-chain-dialog-service';

@Component({
  selector: 'app-ag-grid-cex-chains-container',
  imports: [
    AgGrid,
    HeaderContentLayout,
    TitleTableButton,
    Loader,
    AsyncPipe,
  ],
  templateUrl: './ag-grid-cex-chains-container.html',
  styleUrl: './ag-grid-cex-chains-container.scss',
})
export class AgGridCexChainsContainer implements OnInit {
  private store = inject(Store);
  readonly cexChainDialog = inject(CexChainDialogService);
  readonly deleteDialog = inject(DeleteDialogService);

  chainsDataResponse$ = this.store.select(getCexChainsDataResponse);
  chainsDataIsLoading$ = this.store.select(getCexChainsDataIsLoading);
  chainsDataIsLoaded$ = this.store.select(getCexChainsDataIsLoaded);
  filteredItemCount: number = 0;

  readonly colDefs: ColDef[] = [
    {
      headerName: 'Actions',
      width: 125,
      cellRenderer: ActionsContainer,
      cellRendererParams: {
        onAction: this.onAction.bind(this),
      },
    },
    {
      field: "id",
      headerName: 'Chain ID',
      flex: 1,
    },
    {
      field: "name",
      headerName: 'Chain Name',
      flex: 1,
    },
  ];

  readonly defaultColDef: ColDef = {
    sortable: false,
    cellStyle: { textAlign: 'center', userSelect: 'text'},
    minWidth: 110,
    suppressMovable: true,
    headerClass: 'align-center',
  };
  ngOnInit() {
    this.store.dispatch(setCexChainsData());
    this.store.select(getCexChainsDataResponse).subscribe(data => {
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
    this.cexChainDialog.openCreate().subscribe(result => {
      if (result?.data === 'add') {
        this.store.dispatch(createCexChain({ data: result.formData }));
      }
    });
  }

  openEditDialog(row: any) {
    this.cexChainDialog.openEdit(row).subscribe(result => {
      if (result?.data === 'save') {
        console.log(result.formData)
        this.store.dispatch(editCexChain({ data: result.formData }));
      }
    });
  }

  openDeleteDialog(row: any) {
    this.deleteDialog.openDelete(row.name, 'chain').subscribe(result => {
      if (result?.data === 'yes') {
        this.store.dispatch(deletingCexChain({ chainId: row.id }));
      }
    });
  }

  events($event: any) {
    if ($event.event === 'AgGrid:MODEL_UPDATED') {
      this.filteredItemCount = $event.rowsDisplayed;
    }
  }
}
