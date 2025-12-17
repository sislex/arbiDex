import { inject, Injectable } from '@angular/core';
import { ConfirmationPopUpContainer } from '../containers/confirmation-pop-up-container/confirmation-pop-up-container';
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
      // height: '90%',
      maxWidth: '100%',
      maxHeight: '600px',
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
      panelClass: 'custom-dialog-container',
      data: {
        title: 'Edit token',
        buttons: ['edit', 'cancel'],
        list: list$,
        form: { ...row }
      }
    }).afterClosed();
  }

  openDelete(row: any) {
    return this.dialog.open(ConfirmationPopUpContainer, {
      width: '400px',
      height: '300px',
      data: {
        title: 'Delete token',
        message: `Are you sure you want to delete "${row?.tokenName}"?`,
        buttons: ['yes', 'no']
      }
    }).afterClosed();
  }
}
