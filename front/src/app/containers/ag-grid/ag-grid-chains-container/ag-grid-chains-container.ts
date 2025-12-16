import { Component } from '@angular/core';
import {ColDef} from 'ag-grid-community';
import {AgGrid} from '../../../components/ag-grid/ag-grid';

@Component({
  selector: 'app-ag-grid-chains-container',
  imports: [
    AgGrid,
  ],
  templateUrl: './ag-grid-chains-container.html',
  styleUrl: './ag-grid-chains-container.scss',
})
export class AgGridChainsContainer {
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
      field: "chain_id",
      headerName: 'ID',
    },
    {
      field: "name",
      headerName: 'Name',
    },
  ];

  defaultColDef: ColDef = {
    sortable: false,
    cellStyle: { textAlign: 'center'},
    suppressMovable: true,
    headerClass: 'align-center',
    flex: 1
  };
}
