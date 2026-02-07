import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PoolFormContainer } from '../containers/forms/pool-form-container/pool-form-container';

@Injectable({
  providedIn: 'root',
})
export class PoolDialogService {
  private dialog = inject(MatDialog);
  openCreate() {
    return this.dialog.open(PoolFormContainer, {
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
          chainId: null,
          versionId: null,
          token0: null,
          token1: null,
          dexId: null,
          fee: null,
          poolAddress: '',
        },
      },

    }).afterClosed();
  }

  openEdit( row: any ) {
    return this.dialog.open(PoolFormContainer, {
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
          chainId: row.chainId,
          version: row.version,
          token0: row.token0Id,
          token1: row.token1Id,
          dexId: row.dexId,
          fee: row.fee,
          poolAddress: row.poolAddress,
        }
      }
    }).afterClosed();
  }
}
