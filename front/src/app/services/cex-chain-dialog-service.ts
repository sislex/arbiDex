import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {CexChainFormContainer} from '../containers/forms/cex-chain-form-container/cex-chain-form-container';

@Injectable({
  providedIn: 'root',
})
export class CexChainDialogService {
  private dialog = inject(MatDialog);
  openCreate() {
    return this.dialog.open(CexChainFormContainer, {
      width: '90%',
      height: '90%',
      maxWidth: '100%',
      minHeight: '400px',
      minWidth: '600px',
      panelClass: 'custom-dialog-container',
      data: {
        title: 'Add new cex chain',
        buttons: ['add', 'cancel'],
        form: {
          chainId: null,
          name: '',
        }
      }
    }).afterClosed();
  }

  openEdit(row: any) {
    return this.dialog.open(CexChainFormContainer, {
      width: '90%',
      height: '90%',
      maxWidth: '100%',
      minHeight: '400px',
      minWidth: '600px',
      panelClass: 'custom-dialog-container',
      data: {
        title: 'Edit cex chain',
        buttons: ['save', 'cancel'],
        form: { ...row }
      }
    }).afterClosed();
  }
}
