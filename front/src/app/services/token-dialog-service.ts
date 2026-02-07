import { inject, Injectable } from '@angular/core';
import { TokenFormContainer } from '../containers/forms/token-form-container/token-form-container';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root',
})
export class TokenDialogService {
  private dialog = inject(MatDialog);

  openCreate(list$: Observable<any>) {
    return this.dialog.open(TokenFormContainer, {
      width: '90%',
      height: '90%',
      maxWidth: '100%',
      minHeight: '400px',
      minWidth: '600px',
      panelClass: 'custom-dialog-container',
      data: {
        title: 'Add new token',
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

  openEdit(row: any, list$: Observable<any>) {
    return this.dialog.open(TokenFormContainer, {
      width: '90%',
      height: '90%',
      maxWidth: '100%',
      minHeight: '400px',
      minWidth: '600px',
      panelClass: 'custom-dialog-container',
      data: {
        title: 'Edit token',
        buttons: ['save', 'cancel'],
        list: list$,
        form: {
          tokenId: row.tokenId,
          chainId: row.chainId,
          address: row.address,
          symbol: row.symbol,
          tokenName: row.tokenName,
          decimals: row.decimals,
        }
      }
    }).afterClosed();
  }
}
