import {Component, inject, OnInit} from '@angular/core';
import {ColDef} from 'ag-grid-community';
import {AgGrid} from '../../../components/ag-grid/ag-grid';
import { deletingToken, setTokensData } from '../../../+state/db-config/db-config.actions';
import {getTokensDataResponse} from '../../../+state/db-config/db-config.selectors';
import {AsyncPipe} from '@angular/common';
import {Store} from '@ngrx/store';
import { ActionsContainer } from '../../actions-container/actions-container';
import { ConfirmationPopUpContainer } from '../../confirmation-pop-up-container/confirmation-pop-up-container';
import { MatDialog } from '@angular/material/dialog';

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
    },
    {
      field: "chainId",
      headerName: 'Chain ID',
    },
    {
      field: "address",
      headerName: 'Address',
    },
    {
      field: "symbol",
      headerName: 'Symbol',
    },
    {
      field: "decimals",
      headerName: 'Decimals',
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
    flex: 1
  };

  onAction($event: any, row: any) {
    console.log(row, $event)
    if ($event.event === 'Actions:ACTION_CLICKED') {
      if ($event.actionType === 'delete') {
        this.openDeleteDialog(row);
      }
    } else if ($event.event === 'Toggle:TOGGLE_CLICKED') {
      // this.store.dispatch(isSendData({isSendData: $event.newValue, id: row.id}))
    }
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
