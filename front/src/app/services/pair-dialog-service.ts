import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PairFormContainer } from '../containers/forms/pair-form-container/pair-form-container';
import { Observable } from 'rxjs';
import { IPools, ISelectMenu } from '../models/db-config';

@Injectable({
  providedIn: 'root',
})
export class PairDialogService {
  private dialog = inject(MatDialog);
  openCreate(
    poolList$: Observable<ISelectMenu[]>,
    poolsListResponse$: Observable<IPools[]>,
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
          poolId: null,
          tokenIn: null,
          tokenOut: null
        },
        poolList: poolList$,
        poolsListResponse: poolsListResponse$,
      }
    }).afterClosed();
  }

  openEdit(
    row: any,
    poolList$: Observable<ISelectMenu[]>,
    poolsListResponse$: Observable<IPools[]>,
  ) {
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
        form: {
          pairId: row.pairId,
          poolId: row.poolId,
          tokenInId: row.tokenInId,
          tokenOutId: row.tokenOutId,
        },
        poolList: poolList$,
        poolsListResponse: poolsListResponse$,
      }
    }).afterClosed();
  }

}
