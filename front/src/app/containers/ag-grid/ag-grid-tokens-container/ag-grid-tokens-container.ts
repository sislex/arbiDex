import {Component, inject, OnInit} from '@angular/core';
import {ColDef} from 'ag-grid-community';
import {AgGrid} from '../../../components/ag-grid/ag-grid';
import { deletingToken, editToken, setTokensData } from '../../../+state/db-config/db-config.actions';
import { getChainsDataResponse, getTokensDataResponse } from '../../../+state/db-config/db-config.selectors';
import {AsyncPipe} from '@angular/common';
import {Store} from '@ngrx/store';
import { ActionsContainer } from '../../actions-container/actions-container';
import { ConfirmationPopUpContainer } from '../../confirmation-pop-up-container/confirmation-pop-up-container';
import { MatDialog } from '@angular/material/dialog';
import { TokenFormContainer } from '../../forms/token-form-container/token-form-container';
import { map } from 'rxjs';

@Component({
  selector: 'app-ag-grid-tokens-container',
  imports: [
    AgGrid,
    AsyncPipe
  ],
  templateUrl: './ag-grid-tokens-container.html',
  styleUrl: './ag-grid-tokens-container.scss',
})
export class AgGridTokensContainer implements OnInit {
  private store = inject(Store);
  readonly dialog = inject(MatDialog);

  tokensDataResponse$ = this.store.select(getTokensDataResponse);
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
      headerName: 'Delete',
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

  openEditDialog(row: any) {
    const dialogRef = this.dialog.open(TokenFormContainer, {
      width: '90%',
      height: '90%',
      maxWidth: '100%',
      maxHeight: '100%',
      panelClass: 'custom-dialog-container',
      data: {
        title: 'Edit token',
        buttons: ['edit', 'cancel'],
        list: this.list$,
        form: { ...row },
      },

    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (result.data === 'edit') {
          this.store.dispatch(editToken({data: result.formData}))
        } else {
        }
      } else {
        console.log('Deletion cancelled');
      }
    });
  }

  openDeleteDialog(rowData: any) {
    const dialogRef = this.dialog.open(ConfirmationPopUpContainer, {
      width: '400px',
      height: '300px',
      data: {
        title: 'Delete bot',
        message: `Are you sure you want to delete "${rowData?.address}"?`,
        buttons: ['yes', 'no']
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (result.data === 'yes') {
          this.store.dispatch(deletingToken({tokenId: rowData.tokenId}))
        } else {
        }
      } else {
        console.log('Deletion cancelled');
      }
    });
  }

}
