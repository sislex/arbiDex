import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { QuoteFormContainer } from '../containers/forms/quote-form-container/quote-form-container';

@Injectable({
  providedIn: 'root',
})
export class QuoteDialogService {
  private dialog = inject(MatDialog);
  openCreate() {
    return this.dialog.open(QuoteFormContainer, {
      width: '90%',
      height: '90%',
      maxWidth: '100%',
      minHeight: '400px',
      minWidth: '600px',
      panelClass: 'custom-dialog-container',
      data: {
        title: 'Add new quote',
        buttons: ['add', 'cancel'],
        form: {
          amount: '',
          side: 'exactIn',
          blockTag: 'latest',
          quoteSource: '',
          token: null
        }
      }
    }).afterClosed();
  }

  openEdit(row: any) {
    return this.dialog.open(QuoteFormContainer, {
      width: '90%',
      height: '90%',
      maxWidth: '100%',
      minHeight: '400px',
      minWidth: '600px',
      panelClass: 'custom-dialog-container',
      data: {
        title: 'Edit quote',
        buttons: ['save', 'cancel'],
        form: {
          quoteId: row.quoteId,
          amount: row.amount,
          side: row.side,
          blockTag: row.blockTag,
          quoteSource: row.quoteSource,
          token: row.token.tokenId,
        }
      }
    }).afterClosed();
  }

}
