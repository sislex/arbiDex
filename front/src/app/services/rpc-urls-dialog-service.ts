import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RpcUrlFormContainer } from '../containers/forms/rpc-url-form-container/rpc-url-form-container';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RpcUrlsDialogService {

  private dialog = inject(MatDialog);
  openCreate(
    chainsList$: Observable<any>,
  ) {
    return this.dialog.open(RpcUrlFormContainer, {
      width: '90%',
      height: '90%',
      maxWidth: '100%',
      minHeight: '400px',
      minWidth: '600px',
      panelClass: 'custom-dialog-container',
      data: {
        title: 'Add new rpc url',
        buttons: ['add', 'cancel'],
        chainsList: chainsList$,
        form: {
          amount: '',
          side: 'exactIn',
          blockTag: 'latest',
          quoteSource: ''
        }
      }
    }).afterClosed();
  }

  openEdit(
    row: any,
    chainsList$: Observable<any>,
  ) {
    return this.dialog.open(RpcUrlFormContainer, {
      width: '90%',
      height: '90%',
      maxWidth: '100%',
      minHeight: '400px',
      minWidth: '600px',
      panelClass: 'custom-dialog-container',
      data: {
        title: 'Edit quote',
        buttons: ['save', 'cancel'],
        chainsList: chainsList$,
        form: { ...row }
      }
    }).afterClosed();
  }
}
