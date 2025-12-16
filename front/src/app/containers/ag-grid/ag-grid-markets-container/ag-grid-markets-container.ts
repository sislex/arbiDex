import { Component, inject } from '@angular/core';
import {ColDef} from 'ag-grid-community';
import {AgGrid} from '../../../components/ag-grid/ag-grid';
import { HeaderContentLayout } from '../../../components/layouts/header-content-layout/header-content-layout';
import { TitleTableButton } from '../../../components/title-table-button/title-table-button';
import { Store } from '@ngrx/store';
import { MarketDialogService } from '../../../services/market-dialog-service';

@Component({
  selector: 'app-ag-grid-markets-container',
  imports: [
    AgGrid,
    HeaderContentLayout,
    TitleTableButton,
  ],
  templateUrl: './ag-grid-markets-container.html',
  styleUrl: './ag-grid-markets-container.scss',
})
export class AgGridMarketsContainer {
  private store = inject(Store);
  readonly marketDialog = inject(MarketDialogService);

  list$: any;

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
      field: "market_id",
      headerName: 'Market ID',
    },
    {
      field: "pool_id",
      headerName: 'Pool ID',
    },
    {
      field: "amount",
      headerName: 'Amount',
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
    this.marketDialog.openCreate(this.list$).subscribe(result => {
      if (result?.data === 'add') {
        // this.store.dispatch(createMarket({ data: result.formData }));
      }
    });
  }
}
