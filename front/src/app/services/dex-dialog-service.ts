import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { DexFormContainer } from '../containers/forms/dex-form-container/dex-form-container';

@Injectable({
  providedIn: 'root',
})
export class DexDialogService {
  private dialog = inject(MatDialog);
  openCreate(list$: Observable<any>) {
    return this.dialog.open(DexFormContainer, {
      width: '90%',
      maxWidth: '100%',
      maxHeight: '600px',
      minHeight: '400px',
      minWidth: '600px',
      panelClass: 'custom-dialog-container',
      data: {
        title: 'Add new dex',
        buttons: ['add', 'cancel'],
        list: list$,
        form: {
          dexId: null,
          name: '',
        }
      }
    }).afterClosed();
  }

  openEdit(row: any, list$: Observable<any>) {
    return this.dialog.open(DexFormContainer, {
      width: '90%',
      height: '90%',
      maxWidth: '100%',
      panelClass: 'custom-dialog-container',
      data: {
        title: 'Edit dex',
        buttons: ['edit', 'cancel'],
        list: list$,
        form: { ...row }
      }
    }).afterClosed();
  }
}
