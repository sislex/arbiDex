import {Component, inject, OnInit} from '@angular/core';
import {ColDef} from 'ag-grid-community';
import {AgGrid} from '../../../components/ag-grid/ag-grid';
import { createToken, deletingToken, editToken, setTokensData } from '../../../+state/db-config/db-config.actions';
import {
  getChainsDataResponse, getTokensDataIsLoaded,
  getTokensDataIsLoading,
  getTokensDataResponse,
} from '../../../+state/db-config/db-config.selectors';
import {AsyncPipe} from '@angular/common';
import {Store} from '@ngrx/store';
import { ActionsContainer } from '../../actions-container/actions-container';
import { map } from 'rxjs';
import { HeaderContentLayout } from '../../../components/layouts/header-content-layout/header-content-layout';
import { TitleTableButton } from '../../../components/title-table-button/title-table-button';
import { TokenDialogService } from '../../../services/token-dialog-service';
import { Loader } from '../../../components/loader/loader';
import { DeleteDialogService } from '../../../services/delete-dialog-service';

@Component({
  selector: 'app-ag-grid-tokens-container',
  imports: [
    AgGrid,
    AsyncPipe,
    HeaderContentLayout,
    TitleTableButton,
    Loader,
  ],
  templateUrl: './ag-grid-tokens-container.html',
  styleUrl: './ag-grid-tokens-container.scss',
})
export class AgGridTokensContainer implements OnInit {
  private store = inject(Store);
  readonly tokenDialog = inject(TokenDialogService);
  readonly deleteDialog = inject(DeleteDialogService);

  tokensDataResponse$ = this.store.select(getTokensDataResponse);
  getTokensDataIsLoading$ = this.store.select(getTokensDataIsLoading);
  getTokensDataIsLoaded$ = this.store.select(getTokensDataIsLoaded);

  list$ = this.store.select(getChainsDataResponse).pipe(
    map(chains =>
      chains.map(chain => ({
        id: String(chain.chainId),
        name: chain.name,
      }))
    )
  );

  ngOnInit() {
    this.store.dispatch(setTokensData());
  };

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
      field: "tokenId",
      headerName: 'Token ID',
      flex: 1,
    },
    {
      field: "tokenName",
      headerName: 'Token Name',
      flex: 1,
    },
    {
      field: "chainId",
      headerName: 'Chain ID',
      flex: 1
    },
    {
      field: "address",
      headerName: 'Address',
      flex: 1
    },
    {
      field: "symbol",
      headerName: 'Symbol',
      flex: 1,
    },
    {
      field: "decimals",
      headerName: 'Decimals',
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
    this.tokenDialog.openCreate(this.list$).subscribe(result => {
      if (result?.data === 'add') {
        this.store.dispatch(createToken({ data: result.formData }));
      }
    });
  }

  openEditDialog(row: any) {
    this.tokenDialog.openEdit(row, this.list$).subscribe(result => {
      if (result?.data === 'save') {
        this.store.dispatch(editToken({ data: result.formData }));
      }
    });
  }

  openDeleteDialog(row: any) {
    this.deleteDialog.openDelete(row, 'token').subscribe(result => {
      if (result?.data === 'yes') {
        this.store.dispatch(deletingToken({ tokenId: row.tokenId }));
      }
    });
  }
}
