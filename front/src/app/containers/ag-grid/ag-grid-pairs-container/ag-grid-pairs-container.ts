import { Component, inject } from '@angular/core';
import { AgGrid } from '../../../components/ag-grid/ag-grid';
import { HeaderContentLayout } from '../../../components/layouts/header-content-layout/header-content-layout';
import { TitleTableButton } from '../../../components/title-table-button/title-table-button';
import { ColDef } from 'ag-grid-community';
import { DeleteDialogService } from '../../../services/delete-dialog-service';
import { Store } from '@ngrx/store';
import { ActionsContainer } from '../../actions-container/actions-container';
import {
  getPairsDataIsLoaded,
  getPairsDataIsLoading,
  getPairsDataResponse, getPoolsDataResponse,
} from '../../../+state/db-config/db-config.selectors';
import { createPair, deletingPair, editPair, setPairsData } from '../../../+state/db-config/db-config.actions';
import { AsyncPipe } from '@angular/common';
import { Loader } from '../../../components/loader/loader';
import { PairDialogService } from '../../../services/pair-dialog-service';
import { map } from 'rxjs';

@Component({
  selector: 'app-ag-grid-pairs-container',
  imports: [
    AgGrid,
    HeaderContentLayout,
    TitleTableButton,
    AsyncPipe,
    Loader,
  ],
  templateUrl: './ag-grid-pairs-container.html',
  styleUrl: './ag-grid-pairs-container.scss',
})
export class AgGridPairsContainer {
  private store = inject(Store);
  readonly deleteDialog = inject(DeleteDialogService);
  readonly pairDialog = inject(PairDialogService);

  pairsDataResponse$ = this.store.select(getPairsDataResponse);
  pairsDataIsLoading$ = this.store.select(getPairsDataIsLoading);
  pairsDataIsLoaded$ = this.store.select(getPairsDataIsLoaded);

  poolsList$ = this.store.select(getPoolsDataResponse).pipe(
      map(item =>
        item.map(item => ({
          id: item.poolId,
          name: item.poolAddress.toString(),
        }))
      )
    );

  readonly colDefs: ColDef[] = [
    {
      field: "pairId",
      headerName: 'Pair ID',
      flex: 1,
    },
    {
      headerName: 'Pool ID',
      flex: 1,
      valueGetter: (params) => {
        return params.data?.pool?.poolId || '-';
      },
    },
    {
      headerName: 'Token In',
      flex: 1,
      valueGetter: (params) => {
        return params.data?.tokenIn?.tokenId || '-';
      },
    },
    {
      headerName: 'Token Out',
      flex: 1,
      valueGetter: (params) => {
        return params.data?.tokenOut?.tokenId || '-';
      },
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
    this.store.dispatch(setPairsData());
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
      this.pairDialog.openCreate(this.poolsList$).subscribe(result => {
        if (result?.data === 'add') {
          this.store.dispatch(createPair({ data: result.formData }));
        }
      });
  }

  openEditDialog(row: any) {
      this.pairDialog.openEdit(row, this.poolsList$).subscribe(result => {
        if (result?.data === 'save') {
          this.store.dispatch(editPair({ data: result.formData }));
        }
      });
  }

  openDeleteDialog(row: any) {
    this.deleteDialog.openDelete(row.pairId, 'pair').subscribe(result => {
      if (result?.data === 'yes') {
        this.store.dispatch(deletingPair({ pairId: row.pairId }));
      }
    });
  }
}
