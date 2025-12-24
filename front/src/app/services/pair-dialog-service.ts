import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PairFormContainer } from '../containers/forms/pair-form-container/pair-form-container';
import { Observable } from 'rxjs';
import { ISelectMenu } from '../models/db-config';

@Injectable({
  providedIn: 'root',
})
export class PairDialogService {
  private dialog = inject(MatDialog);
  openCreate(
    poolList$: Observable<ISelectMenu[]>,
  ) {
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
          pairId: null,
          pool: {
            poolId: null,
            token: null,
            token2: null,
          },
          tokenIn: {
            tokenId: null,
          },
          tokenOut: {
            tokenId: null,
          },
        },
        poolList: poolList$
      }
    }).afterClosed();
  }

  openEdit(
    row: any,
    poolList$: Observable<ISelectMenu[]>,
  ) {
    console.log(row)
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
        form: { ...row },
        poolList: poolList$
      }
    }).afterClosed();
  }

}
