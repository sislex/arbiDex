import { inject, Injectable } from '@angular/core';
import { ConfirmationPopUpContainer } from '../containers/confirmation-pop-up-container/confirmation-pop-up-container';
import { MatDialog } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root',
})
export class DeleteDialogService {
  private dialog = inject(MatDialog);

  openDelete(name: any, title: string) {
    return this.dialog.open(ConfirmationPopUpContainer, {
      width: '400px',
      height: '300px',
      data: {
        title: `Delete ${title}`,
        message: `Are you sure you want to delete`,
        boldMessage: ` "${name}"?`,
        buttons: ['yes', 'no']
      }
    }).afterClosed();
  }
}
