import { Component, inject, OnInit } from '@angular/core';
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
import { createMarket, setMarketsData } from '../../../+state/db-config/db-config.actions';
import { map } from 'rxjs';
import { ActionsContainer } from '../../actions-container/actions-container';

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
export class AgGridMarketsContainer implements OnInit {
  private store = inject(Store);
  readonly marketDialog = inject(MarketDialogService);

  marketsDataResponse$ = this.store.select(getMarketsDataResponse);
  marketsDataIsLoading$ = this.store.select(getMarketsDataIsLoading);
  marketsDataIsLoaded$ = this.store.select(getMarketsDataIsLoaded);

  list$ = this.store.select(getPoolsDataResponse).pipe(
    map(item =>
      item.map(item => ({
        id: String(item.poolId),
        name: item.poolAddress,
      }))
    )
  );

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

  defaultColDef: ColDef = {
    sortable: false,
    cellStyle: { textAlign: 'center'},
    suppressMovable: true,
    headerClass: 'align-center',
  };

  ngOnInit() {
    this.store.dispatch((setMarketsData()));
  };

  onAction() {

  };

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
}
