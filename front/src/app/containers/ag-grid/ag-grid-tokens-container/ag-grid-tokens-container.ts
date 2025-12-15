import {Component, inject, OnInit} from '@angular/core';
import {ColDef} from 'ag-grid-community';
import {AgGrid} from '../../../components/ag-grid/ag-grid';
import {setTokensData} from '../../../+state/db-config/db-config.actions';
import {getTokensDataResponse} from '../../../+state/db-config/db-config.selectors';
import {AsyncPipe} from '@angular/common';
import {Store} from '@ngrx/store';

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
  ];

  defaultColDef: ColDef = {
    sortable: false,
    cellStyle: { textAlign: 'center'},
    suppressMovable: true,
    flex: 1
  };

}
