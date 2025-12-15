import { Component } from '@angular/core';
import {ColDef} from 'ag-grid-community';
import {AgGrid} from '../../../components/ag-grid/ag-grid';

@Component({
  selector: 'app-ag-grid-dexes-container',
  imports: [
    AgGrid
  ],
  templateUrl: './ag-grid-dexes-container.html',
  styleUrl: './ag-grid-dexes-container.scss',
})
export class AgGridDexesContainer {


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
      field: "dexes_id",
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
    flex: 1
  };

}
