import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BotFormContainer } from '../containers/forms/bot-form-container/bot-form-container';

@Injectable({
  providedIn: 'root',
})
export class BotDialogService {
  private dialog = inject(MatDialog);
  openCreate() {
    return this.dialog.open(BotFormContainer, {
      width: '90%',
      maxWidth: '100%',
      maxHeight: '600px',
      minHeight: '400px',
      minWidth: '600px',
      panelClass: 'custom-dialog-container',
      data: {
        title: 'Add new bot',
        buttons: ['add', 'cancel'],
        form: {
          chainId: null,
          name: '',
        }
      }
    }).afterClosed();
  }

  openEdit(row: any) {
    return this.dialog.open(BotFormContainer, {
      width: '90%',
      height: '90%',
      maxWidth: '100%',
      panelClass: 'custom-dialog-container',
      data: {
        title: 'Edit bot',
        buttons: ['save', 'cancel'],
        form: { ...row }
      }
    }).afterClosed();
  }

}
