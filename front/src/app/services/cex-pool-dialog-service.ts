import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {CexPoolFormContainer} from '../containers/forms/cex-pool-form-container/cex-pool-form-container';

@Injectable({
  providedIn: 'root',
})
export class CexPoolDialogService {
  private dialog = inject(MatDialog);
  openCreate() {
    return this.dialog.open(CexPoolFormContainer, {
      width: '90%',
      height: '90%',
      maxWidth: '100%',
      minHeight: '400px',
      minWidth: '600px',
      panelClass: 'custom-dialog-container',
      data: {
        title: 'Add new pool',
        buttons: ['add', 'cancel'],
        form: {
          source: null,
          token0: null,
          token1: null,
        },
      },

    }).afterClosed();
  }

  openEdit( row: any ) {
    return this.dialog.open(CexPoolFormContainer, {
      width: '90%',
      height: '90%',
      maxWidth: '100%',
      minHeight: '400px',
      minWidth: '600px',
      panelClass: 'custom-dialog-container',
      data: {
        title: 'Edit pool',
        buttons: ['save', 'cancel'],
        form: {
          poolId: row.poolId,
          source: row.chainId,
          token0: row.token0Id,
          token1: row.token1Id,
        }
      }
    }).afterClosed();
  }
}
