import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PairFormContainer } from '../containers/forms/pair-form-container/pair-form-container';

@Injectable({
  providedIn: 'root',
})
export class PairDialogService {
  private dialog = inject(MatDialog);
  openCreate() {
    return this.dialog.open(PairFormContainer, {
      width: '90%',
      height: '90%',
      maxWidth: '100%',
      minHeight: '400px',
      minWidth: '600px',
      panelClass: 'custom-dialog-container',
      data: {
        title: 'Add new pair',
        buttons: ['add', 'cancel'],
        form: {
          chainId: null,
          name: '',
        }
      }
    }).afterClosed();
  }

  openEdit(row: any) {
    return this.dialog.open(PairFormContainer, {
      width: '90%',
      height: '90%',
      maxWidth: '100%',
      minHeight: '400px',
      minWidth: '600px',
      panelClass: 'custom-dialog-container',
      data: {
        title: 'Edit pair',
        buttons: ['save', 'cancel'],
        form: { ...row }
      }
    }).afterClosed();
  }

}
