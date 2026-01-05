import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfigDialogContainer } from '../containers/config-dialog-container/config-dialog-container';

@Injectable({
  providedIn: 'root',
})
export class ConfigDialogService {
  private dialog = inject(MatDialog);
  openConfig(
    configTitle: string,
    configString: string,
  ) {
    return this.dialog.open(ConfigDialogContainer, {
      width: '90%',
      height: '90%',
      maxWidth: '100%',
      minHeight: '400px',
      minWidth: '600px',
      panelClass: 'custom-dialog-container',
      data: {
        title: configTitle,
        buttons: ['copy all', 'cancel'],
        configString
      }
    }).afterClosed();
  }
}
