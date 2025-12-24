import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ServerFormContainer } from '../containers/forms/server-form-container/server-form-container';

@Injectable({
  providedIn: 'root',
})
export class ServerDialogService {
  private dialog = inject(MatDialog);
  openCreate() {
    return this.dialog.open(ServerFormContainer, {
      width: '90%',
      maxWidth: '100%',
      maxHeight: '600px',
      minHeight: '400px',
      minWidth: '600px',
      panelClass: 'custom-dialog-container',
      data: {
        title: 'Add new server',
        buttons: ['add', 'cancel'],
        form: {
          chainId: null,
          name: '',
        }
      }
    }).afterClosed();
  }

  openEdit(row: any) {
    return this.dialog.open(ServerFormContainer, {
      width: '90%',
      height: '90%',
      maxWidth: '100%',
      panelClass: 'custom-dialog-container',
      data: {
        title: 'Edit server',
        buttons: ['save', 'cancel'],
        form: { ...row }
      }
    }).afterClosed();
  }

}
