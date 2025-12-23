import { Component, inject } from '@angular/core';
import {ColDef} from 'ag-grid-community';
import {AgGrid} from '../../../components/ag-grid/ag-grid';
import { HeaderContentLayout } from '../../../components/layouts/header-content-layout/header-content-layout';
import { TitleTableButton } from '../../../components/title-table-button/title-table-button';
import { Store } from '@ngrx/store';
import { MarketDialogService } from '../../../services/market-dialog-service';
import {
  getMarketsDataIsLoaded,
  getMarketsDataIsLoading,
  getMarketsDataResponse,
  getPoolsDataResponse,
} from '../../../+state/db-config/db-config.selectors';
import { AsyncPipe } from '@angular/common';
import { Loader } from '../../../components/loader/loader';
import {
  createMarket,
  deletingMarket, editMarket,
  setMarketsData,
} from '../../../+state/db-config/db-config.actions';
import { map } from 'rxjs';
import { ActionsContainer } from '../../actions-container/actions-container';
import { DeleteDialogService } from '../../../services/delete-dialog-service';

@Component({
  selector: 'app-ag-grid-markets-container',
  imports: [
    AgGrid,
    HeaderContentLayout,
    TitleTableButton,
    AsyncPipe,
    Loader,
  ],
  templateUrl: './ag-grid-markets-container.html',
  styleUrl: './ag-grid-markets-container.scss',
})
export class AgGridMarketsContainer {
  private store = inject(Store);
  readonly marketDialog = inject(MarketDialogService);
  readonly deleteDialog = inject(DeleteDialogService);

  marketsDataResponse$ = this.store.select(getMarketsDataResponse);
  marketsDataIsLoading$ = this.store.select(getMarketsDataIsLoading);
  marketsDataIsLoaded$ = this.store.select(getMarketsDataIsLoaded);

  list$ = this.store.select(getPoolsDataResponse).pipe(
    map(item =>
      item.map(item => ({
        id: item.poolId,
        name: item.poolAddress,
      }))
    )
  );

  readonly colDefs: ColDef[] = [
    {
      field: "marketId",
      headerName: 'Market ID',
      flex: 1,
    },
    {
      field: "poolId",
      headerName: 'Pool ID',
      flex: 1,
    },
    {
      field: "amount",
      headerName: 'Amount',
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
    this.store.dispatch((setMarketsData()));
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
    this.marketDialog.openCreate(this.list$).subscribe(result => {
      if (result?.data === 'add') {
        this.store.dispatch(createMarket({ data: result.formData }));
      }
    });
  }

  openEditDialog(row: any) {
    this.marketDialog.openEdit(row, this.list$).subscribe(result => {
      if (result?.data === 'save') {
        this.store.dispatch(editMarket({ data: result.formData }));
      }
    });
  }

  openDeleteDialog(row: any) {
    this.deleteDialog.openDelete(row.marketId, 'market').subscribe(result => {
      if (result?.data === 'yes') {
        this.store.dispatch(deletingMarket({ marketId: row.marketId }));
      }
    });
  }
}
