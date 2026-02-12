import {Component, inject, OnInit} from '@angular/core';
import {AgGrid} from '../../../components/ag-grid/ag-grid';
import {ColDef} from 'ag-grid-community';
import {AsyncPipe} from '@angular/common';
import {Store} from '@ngrx/store';
import {getPairsRating} from '../../../+state/db-config/db-config.selectors';
import {TitleTableButton} from '../../../components/title-table-button/title-table-button';

@Component({
  selector: 'app-ag-grid-pair-ratings',
  imports: [
    AgGrid,
    AsyncPipe,
    TitleTableButton
  ],
  templateUrl: './ag-grid-pair-ratings.html',
  styleUrl: './ag-grid-pair-ratings.scss',
})
export class AgGridPairRatings implements OnInit {
  private store = inject(Store);

  pairsRating$ = this.store.select(getPairsRating);
  filteredItemCount: number = 0;

  readonly colDefs: ColDef[] = [
    {
      headerName: 'Token In',
      flex: 1,
      filter: true,
      sortable: true,
      valueGetter: (params) => {
        return params.data?.tokenInName || '-';
      },
    },
    {
      headerName: 'Token Out',
      flex: 1,
      filter: true,
      sortable: true,
      valueGetter: (params) => {
        return params.data?.tokenOutName || '-';
      },
    },
    {
      headerName: 'Token In Address',
      flex: 1,
      filter: true,
      sortable: true,
      valueGetter: (params) => {
        return params.data?.tokenInAddress || '-';
      },
    },
    {
      headerName: 'Token Out Address',
      flex: 1,
      filter: true,
      sortable: true,
      valueGetter: (params) => {
        return params.data?.tokenOutAddress || '-';
      },
    },
    {
      headerName: 'Count',
      flex: 1,
      filter: true,
      sortable: true,
      valueGetter: (params) => {
        return params.data?.countRating || '-';
      },
    },
  ];

  readonly defaultColDef: ColDef = {
    sortable: false,
    suppressMovable: true,
    headerClass: 'align-center',
    minWidth: 110,
    cellStyle: {
      textAlign: 'center',
      userSelect: 'text'
    },
  };

  ngOnInit() {
    this.store.select(getPairsRating).subscribe(data => {
      this.filteredItemCount = data?.length || 0;
    });
  }

  events($event: any) {
    if ($event.event === 'AgGrid:MODEL_UPDATED') {
      this.filteredItemCount = $event.rowsDisplayed;
    }
  }
}
