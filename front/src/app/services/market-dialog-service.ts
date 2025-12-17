import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { MarketFormContainer } from '../containers/forms/market-form-container/market-form-container';

@Injectable({
  providedIn: 'root',
})
export class MarketDialogService {
  private dialog = inject(MatDialog);
  openCreate(list$: Observable<any>) {
    return this.dialog.open(MarketFormContainer, {
      width: '90%',
      maxWidth: '100%',
      maxHeight: '600px',
      minHeight: '400px',
      minWidth: '600px',
      panelClass: 'custom-dialog-container',
      data: {
        title: 'Add new market',
        buttons: ['add', 'cancel'],
        list: list$,
        form: {
          poolId: '',
          amount: '',
        }
      }
    }).afterClosed();
  }
}
