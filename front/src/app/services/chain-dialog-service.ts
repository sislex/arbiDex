import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ChainFormContainer } from '../containers/forms/chain-form-container/chain-form-container';

@Injectable({
  providedIn: 'root',
})
export class ChainDialogService {
  private dialog = inject(MatDialog);
  openCreate() {
    return this.dialog.open(ChainFormContainer, {
      width: '90%',
      maxWidth: '100%',
      maxHeight: '600px',
      minHeight: '400px',
      minWidth: '600px',
      panelClass: 'custom-dialog-container',
      data: {
        title: 'Add new chain',
        buttons: ['add', 'cancel'],
        form: {
          chainId: null,
          name: '',
        }
      }
    }).afterClosed();
  }

  openEdit(row: any) {
    return this.dialog.open(ChainFormContainer, {
      width: '90%',
      height: '90%',
      maxWidth: '100%',
      panelClass: 'custom-dialog-container',
      data: {
        title: 'Edit chain',
        buttons: ['edit', 'cancel'],
        form: { ...row }
      }
    }).afterClosed();
  }
}
