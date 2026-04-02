import {Component, inject, OnInit} from '@angular/core';
import {ColDef} from 'ag-grid-community';
import {AgGrid} from '../../../components/ag-grid/ag-grid';
import { HeaderContentLayout } from '../../../components/layouts/header-content-layout/header-content-layout';
import { TitleTableButton } from '../../../components/title-table-button/title-table-button';
import { Store } from '@ngrx/store';
import {
  getCexPairsDataIsLoaded,
  getCexPairsDataIsLoading,
  getCexPairsDataResponse,
} from '../../../+state/db-config/db-config.selectors';
import { AsyncPipe } from '@angular/common';
import { Loader } from '../../../components/loader/loader';
import {
  createCexPair,
  deletingCexPair,
  editCexPair,
  initCexPairsPage,
  setCexPairsData,
  setReservesInCurrentToken,
} from '../../../+state/db-config/db-config.actions';
import { ActionsContainer } from '../../actions-container/actions-container';
import { DeleteDialogService } from '../../../services/delete-dialog-service';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {FormsModule} from '@angular/forms';
import {CexPairDialogService} from '../../../services/cex-pair-dialog-service';

@Component({
  selector: 'app-ag-grid-cex-pairs-container',
  imports: [
    AgGrid,
    HeaderContentLayout,
    TitleTableButton,
    AsyncPipe,
    Loader,
    MatCheckboxModule,
    FormsModule
  ],
  templateUrl: './ag-grid-cex-pairs-container.html',
  styleUrl: './ag-grid-cex-pairs-container.scss',
})
export class AgGridCexPairsContainer implements OnInit {
  private store = inject(Store);
  readonly pairDialog = inject(CexPairDialogService);
  readonly deleteDialog = inject(DeleteDialogService);

  pairsDataResponse$ = this.store.select(getCexPairsDataResponse);
  cexPairsDataIsLoading$ = this.store.select(getCexPairsDataIsLoading);
  cexPairsDataIsLoaded$ = this.store.select(getCexPairsDataIsLoaded);
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
      headerName: 'Pair ID',
      filter: true,
      sortable: true,
      flex: 1,
    },
    {
      field: "source",
      headerName: 'Source',
      filter: true,
      sortable: true,
      flex: 1,
    },
    {
      headerName: 'Token 0',
      filter: true,
      sortable: true,
      flex: 1,
      valueGetter: (params) => {
        return params.data?.token0 || '-';
      },
    },
    {
      headerName: 'Token 1',
      filter: true,
      sortable: true,
      flex: 1,
      valueGetter: (params) => {
        return params.data?.token1 || '-';
      },
    },
  ];

  readonly defaultColDef: ColDef = {
    sortable: false,
    cellStyle: { textAlign: 'center', userSelect: 'text',},
    minWidth: 110,
    suppressMovable: true,
    headerClass: 'align-center',
  };

  ngOnInit() {
    this.store.dispatch(setCexPairsData());
    this.store.select(getCexPairsDataResponse).subscribe(data => {
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

  actions(_: any, note: string) {
    if (note === 'add' ) {
      this.openCreateDialog();
    }
  }

  openCreateDialog() {
    this.pairDialog.openCreate().subscribe(result => {
      if (result?.data === 'add') {
        this.store.dispatch(createCexPair({ data: result.formData }));
      }
    });
  }

  openEditDialog(row: any) {
    this.pairDialog.openEdit(row).subscribe(result => {
      if (result?.data === 'save') {
        this.store.dispatch(editCexPair({ data: result.formData }));
      }
    });
  }

  openDeleteDialog(row: any) {
    this.deleteDialog.openDelete(row.pairAddress, 'pair').subscribe(result => {
      if (result?.data === 'yes') {
        this.store.dispatch(deletingCexPair({ cexPairId: row.pairId }));
      }
    });
  }

  events($event: any) {
    if ($event.event === 'AgGrid:MODEL_UPDATED') {
      this.filteredItemCount = $event.rowsDisplayed;
    } else if ($event.event === 'SelectField:ITEM_SELECTED') {
      if ($event.data === 0) {
        this.store.dispatch(initCexPairsPage());
      } else {
        this.store.dispatch(setReservesInCurrentToken({currentToken: $event.data}))
      }
    }
  }
}
