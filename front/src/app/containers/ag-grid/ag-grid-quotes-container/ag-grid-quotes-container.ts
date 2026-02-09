import { Component, inject, OnInit } from '@angular/core';
import { AgGrid } from '../../../components/ag-grid/ag-grid';
import { HeaderContentLayout } from '../../../components/layouts/header-content-layout/header-content-layout';
import { TitleTableButton } from '../../../components/title-table-button/title-table-button';
import { ColDef } from 'ag-grid-community';
import { Store } from '@ngrx/store';
import { DeleteDialogService } from '../../../services/delete-dialog-service';
import { ActionsContainer } from '../../actions-container/actions-container';
import { Loader } from '../../../components/loader/loader';
import {
  getFullQuotesDataIsReady,
  getQuotesFullDataResponse,
} from '../../../+state/db-config/db-config.selectors';
import {
  createQuote,
  deletingQuote,
  editQuote,
  initQuotesListPage,
} from '../../../+state/db-config/db-config.actions';
import { AsyncPipe } from '@angular/common';
import { QuoteDialogService } from '../../../services/quote-dialog-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ag-grid-quotes-container',
  imports: [
    AgGrid,
    HeaderContentLayout,
    TitleTableButton,
    Loader,
    AsyncPipe,
  ],
  templateUrl: './ag-grid-quotes-container.html',
  styleUrl: './ag-grid-quotes-container.scss',
})
export class AgGridQuotesContainer implements OnInit {
  private store = inject(Store);
  readonly deleteDialog = inject(DeleteDialogService);
  readonly quoteDialog = inject(QuoteDialogService);
  readonly router = inject(Router);

  quotesDataResponse$ = this.store.select(getQuotesFullDataResponse);
  fullQuotesDataIsReady$ = this.store.select(getFullQuotesDataIsReady);

  readonly colDefs: ColDef[] = [
    {
      field: "quoteId",
      headerName: 'Quote ID',
      flex: 1,
      filter: true,
      sortable: true,
    },
    {
      field: "amount",
      headerName: 'Amount',
      flex: 1,
      filter: true,
      sortable: true,
    },
    {
      field: "side",
      headerName: 'Side',
      flex: 1,
      filter: true,
      sortable: true,
    },
    {
      field: "blockTag",
      headerName: 'Block Tag',
      flex: 1,
      filter: true,
      sortable: true,
    },
    {
      field: "quoteSource",
      headerName: 'Quote Source',
      flex: 1,
      filter: true,
      sortable: true,
    },
    {
      headerName: 'Quote Token',
      flex: 1,
      filter: true,
      sortable: true,
      valueGetter: (params) => {
        return params.data?.tokenName || '-';
      },
    },
    {
      headerName: 'Pairs count',
      flex: 1,
      filter: true,
      sortable: true,
      valueGetter: (params) => {
        return params.data?.pairsCount || '-';
      },
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

  readonly defaultColDef: ColDef = {
    sortable: false,
    suppressMovable: true,
    headerClass: 'align-center',
    cellStyle: {
      textAlign: 'center',
      cursor: 'pointer',
      userSelect: 'text'
    },
  };

  ngOnInit() {
    this.store.dispatch(initQuotesListPage());

  }

  onAction($event: any, row: any) {
    if ($event.event === 'Actions:ACTION_CLICKED') {
      if ($event.actionType === 'delete') {
        this.openDeleteDialog(row);
      } else if ($event.actionType === 'edit') {
        this.openEditDialog(row);
      }
    }
  }

  actions($event: any, note?: any) {
    if ($event.event === 'Actions:ACTION_CLICKED') {
      if (note === 'add') {
        this.openCreateDialog();
      }
    } else if ($event.event === 'AgGrid:DOUBLE_CLICKED_ROW') {
      this.router.navigate([`/data-view/quotes/${$event.row.data.quoteId}`]);
    }
  }

  openCreateDialog() {
    this.quoteDialog.openCreate().subscribe(result => {
      if (result?.data === 'add') {
        this.store.dispatch(createQuote({ data: result.formData }));
      }
    });
  }

  openEditDialog(row: any) {
    this.quoteDialog.openEdit(row).subscribe(result => {
      if (result?.data === 'save') {
        this.store.dispatch(editQuote({ data: result.formData }));
      }
    });
  }

  openDeleteDialog(row: any) {
    this.deleteDialog.openDelete(row.quoteId, 'quote').subscribe(result => {
      if (result?.data === 'yes') {
        this.store.dispatch(deletingQuote({ quoteId: row.quoteId }));
      }
    });
  }
}
