import { Component } from '@angular/core';
import {ColDef} from 'ag-grid-community';
import {AgGrid} from '../../../components/ag-grid/ag-grid';

@Component({
  selector: 'app-ag-grid-markets-container',
  imports: [
    AgGrid
  ],
  templateUrl: './ag-grid-markets-container.html',
  styleUrl: './ag-grid-markets-container.scss',
})
export class AgGridMarketsContainer {
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
    flex: 1
  };

}
