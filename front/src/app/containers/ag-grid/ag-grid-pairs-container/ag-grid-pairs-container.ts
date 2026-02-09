import {ChangeDetectionStrategy, Component, inject, OnInit} from '@angular/core';
import { AgGrid } from '../../../components/ag-grid/ag-grid';
import { HeaderContentLayout } from '../../../components/layouts/header-content-layout/header-content-layout';
import { TitleTableButton } from '../../../components/title-table-button/title-table-button';
import { ColDef } from 'ag-grid-community';
import { DeleteDialogService } from '../../../services/delete-dialog-service';
import { Store } from '@ngrx/store';
import { ActionsContainer } from '../../actions-container/actions-container';
import {
  getFullPairsDataIsReady,
  getPairsFullData,
  getPoolsDataResponse,
} from '../../../+state/db-config/db-config.selectors';
import {
  createPair,
  deletingPair,
  editPair, initPairsPage,
} from '../../../+state/db-config/db-config.actions';
import { AsyncPipe } from '@angular/common';
import { Loader } from '../../../components/loader/loader';
import { PairDialogService } from '../../../services/pair-dialog-service';
import {map, take} from 'rxjs';
import { Router } from '@angular/router';

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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AgGridPairsContainer implements OnInit {
  private store = inject(Store);
  readonly deleteDialog = inject(DeleteDialogService);
  readonly pairDialog = inject(PairDialogService);
  readonly router = inject(Router);

  poolsListResponse$ = this.store.select(getPoolsDataResponse)

  pairsDataResponse$ = this.store.select(getPairsFullData);
  pairsDataIsReady$ = this.store.select(getFullPairsDataIsReady);

  readonly poolsList$ = this.poolsListResponse$.pipe(
    map(items => items.map(item => ({
      id: item.poolId,
      name: item.poolAddress.toString(),
    })))
  );

  readonly colDefs: ColDef[] = [
    {
      field: "pairId",
      headerName: 'Pair ID',
      flex: 1,
      filter: true,
      sortable: true,
    },
    {
      headerName: 'Pool ID',
      flex: 1,
      filter: true,
      sortable: true,
      valueGetter: (params) => {
        return params.data?.poolAddress || '-';
      },
    },
    {
      headerName: 'Token In',
      flex: 1,
      filter: true,
      sortable: true,
      valueGetter: (params) => {
        return params.data?.tokenInName || '-';
      },
    },
    {
      headerName: 'Token Out',
      flex: 1,
      filter: true,
      sortable: true,
      valueGetter: (params) => {
        return params.data?.tokenOutName || '-';
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
    suppressMovable: true,
    headerClass: 'align-center',
    cellStyle: {
      textAlign: 'center',
      userSelect: 'text'
    },
  };

  ngOnInit() {
    this.store.dispatch(initPairsPage());
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

  actions($event: { event: string, data?: any }, note?: string) {
    if ($event.event === 'Actions:ACTION_CLICKED') {
      if (note === 'add') {
        this.openCreateDialog();
      }
    }
  }

  openCreateDialog() {
    this.pairDialog.openCreate(this.poolsList$, this.poolsListResponse$)
      .pipe(take(1))
      .subscribe(result => {
        if (result?.data === 'add') {
          this.store.dispatch(createPair({ data: result.formData }));
        }
      });
  }

  openEditDialog(row: any) {
    this.pairDialog.openEdit(row, this.poolsList$, this.poolsListResponse$).subscribe(result => {
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
