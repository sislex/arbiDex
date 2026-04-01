import {Component, inject, OnInit} from '@angular/core';
import {ColDef} from 'ag-grid-community';
import {AgGrid} from '../../../components/ag-grid/ag-grid';
import { HeaderContentLayout } from '../../../components/layouts/header-content-layout/header-content-layout';
import { TitleTableButton } from '../../../components/title-table-button/title-table-button';
import { Store } from '@ngrx/store';
import {
  getFullPoolsData,
  getFullPoolsDataIsReady,
  getUniqueTokensFromSwapRates,
} from '../../../+state/db-config/db-config.selectors';
import { AsyncPipe } from '@angular/common';
import { Loader } from '../../../components/loader/loader';
import {
  createPool,
  deletingPools,
  editPool,
  initPoolsPage,
  setReservesInCurrentToken,
} from '../../../+state/db-config/db-config.actions';
import { ActionsContainer } from '../../actions-container/actions-container';
import { DeleteDialogService } from '../../../services/delete-dialog-service';
import {map} from 'rxjs';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {FormsModule} from '@angular/forms';
import {displayInWei} from '../../../+state/view/view.selectors';
import {setDisplayInWei} from '../../../+state/view/view.actions';
import {CexPoolDialogService} from '../../../services/cex-pool-dialog-service';

@Component({
  selector: 'app-ag-grid-cex-pools-container',
  imports: [
    AgGrid,
    HeaderContentLayout,
    TitleTableButton,
    AsyncPipe,
    Loader,
    MatCheckboxModule,
    FormsModule
  ],
  templateUrl: './ag-grid-cex-pools-container.html',
  styleUrl: './ag-grid-cex-pools-container.scss',
})
export class AgGridCexPoolsContainer implements OnInit {
  private store = inject(Store);
  readonly poolDialog = inject(CexPoolDialogService);
  readonly deleteDialog = inject(DeleteDialogService);

  poolsDataResponse$ = this.store.select(getFullPoolsData);
  displayInWei$ = this.store.select(displayInWei);
  poolsDataIsReady$ = this.store.select(getFullPoolsDataIsReady);
  filteredItemCount: number = 0;

  swapRateDataResponse$ = this.store.select(getUniqueTokensFromSwapRates).pipe(
    map(tokens =>
      tokens.map(token => ({
        id: token.tokenId,
        name: token.tokenName,
        address: `${token.address} "${token.chainName}"`,
      }))
    )
  );

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
      field: "poolId",
      headerName: 'Pool ID',
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
        return params.data?.token0Name || '-';
      },
    },
    {
      headerName: 'Token 1',
      filter: true,
      sortable: true,
      flex: 1,
      valueGetter: (params) => {
        return params.data?.token1Name || '-';
      },
    },
    {
      headerName: 'Reserve 0',
      filter: true,
      sortable: true,
      flex: 1,
      valueGetter: () => '-'
    },
    {
      headerName: 'Reserve 1',
      filter: true,
      sortable: true,
      flex: 1,
      valueGetter: () => '-'
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
    this.store.dispatch(initPoolsPage());
    this.store.select(getFullPoolsData).subscribe(data => {
      this.filteredItemCount = data?.length || 0;
    });
  }

  onToggleWei($event: any) {
    this.store.dispatch(setDisplayInWei({item: $event }))
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
    this.poolDialog.openCreate().subscribe(result => {
      if (result?.data === 'add') {
        this.store.dispatch(createPool({ data: result.formData }));
      }
    });
  }

  openEditDialog(row: any) {
    this.poolDialog.openEdit(row).subscribe(result => {
      if (result?.data === 'save') {
        this.store.dispatch(editPool({ data: result.formData }));
      }
    });
  }

  openDeleteDialog(row: any) {
    this.deleteDialog.openDelete(row.poolAddress, 'pool').subscribe(result => {
      if (result?.data === 'yes') {
        this.store.dispatch(deletingPools({ poolId: row.poolId }));
      }
    });
  }

  events($event: any) {
    if ($event.event === 'AgGrid:MODEL_UPDATED') {
      this.filteredItemCount = $event.rowsDisplayed;
    } else if ($event.event === 'SelectField:ITEM_SELECTED') {
      if ($event.data === 0) {
        this.store.dispatch(initPoolsPage());
      } else {
        this.store.dispatch(setReservesInCurrentToken({currentToken: $event.data}))
      }
    }
  }
}
