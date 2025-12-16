import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { ChainFormContainer } from '../containers/forms/chain-form-container/chain-form-container';

@Injectable({
  providedIn: 'root',
})
export class ChainDialogService {
  private dialog = inject(MatDialog);
  openCreate(list$: Observable<any>) {
    return this.dialog.open(ChainFormContainer, {
      width: '90%',
      height: '90%',
      maxWidth: '100%',
      panelClass: 'custom-dialog-container',
      data: {
        title: 'Add new chain',
        buttons: ['add', 'cancel'],
        list: list$,
        form: {
          tokenId: null,
          chainId: null,
          address: '',
          symbol: '',
          tokenName: '',
          decimals: null,
        }
      }
    }).afterClosed();
  }
}
