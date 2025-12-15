import { Component } from '@angular/core';
import {ColDef} from 'ag-grid-community';
import {AgGrid} from '../../../components/ag-grid/ag-grid';

@Component({
  selector: 'app-ag-grid-pools-container',
  imports: [
    AgGrid
  ],
  templateUrl: './ag-grid-pools-container.html',
  styleUrl: './ag-grid-pools-container.scss',
})
export class AgGridPoolsContainer {
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
      field: "pool_id",
      headerName: 'Pool ID',
    },
    {
      field: "chain_id",
      headerName: 'Chain ID',
    },
    {
      field: "dex_id",
      headerName: 'Dex ID',
    },
    {
      field: "version",
      headerName: 'Dex version',
    },
    {
      field: "base_token_id",
      headerName: 'Base token ID',
    },
    {
      field: "quote_token_id",
      headerName: 'Quote token ID',
    },
  ];

  defaultColDef: ColDef = {
    sortable: false,
    cellStyle: { textAlign: 'center'},
    suppressMovable: true,
    flex: 1
  };

}
