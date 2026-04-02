import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {CexPairFormContainer} from '../containers/forms/cex-pair-form-container/cex-pair-form-container';

@Injectable({
  providedIn: 'root',
})
export class CexPairDialogService {
  private dialog = inject(MatDialog);
  openCreate() {
    return this.dialog.open(CexPairFormContainer, {
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
          source: null,
          token0: null,
          token1: null,
        },
      },

    }).afterClosed();
  }

  openEdit( row: any ) {
    return this.dialog.open(CexPairFormContainer, {
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
          poolId: row.poolId,
          source: row.chainId,
          token0: row.token0Id,
          token1: row.token1Id,
        }
      }
    }).afterClosed();
  }
}
