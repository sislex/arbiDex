import { Component } from '@angular/core';
import {ColDef} from 'ag-grid-community';
import {AgGrid} from '../../../components/ag-grid/ag-grid';
import { HeaderContentLayout } from '../../../components/layouts/header-content-layout/header-content-layout';
import { TitleTableButton } from '../../../components/title-table-button/title-table-button';

@Component({
  selector: 'app-ag-grid-pools-container',
  imports: [
    AgGrid,
    HeaderContentLayout,
    TitleTableButton,
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
      field: "poolId",
      headerName: 'Pool ID',
    },
    {
      field: "poolAddress",
      headerName: 'Pool Address',
    },
    {
      field: "chainId",
      headerName: 'Chain ID',
    },
    {
      field: "dexId",
      headerName: 'Dex ID',
    },
    {
      field: "version",
      headerName: 'Dex version',
    },
    {
      field: "baseTokenId",
      headerName: 'Base token ID',
    },
    {
      field: "quoteTokenId",
      headerName: 'Quote token ID',
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
    }
  }

}
