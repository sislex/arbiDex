import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { PoolFormContainer } from '../containers/forms/pool-form-container/pool-form-container';

@Injectable({
  providedIn: 'root',
})
export class PoolDialogService {
  private dialog = inject(MatDialog);
  openCreate(
    chainsList$: Observable<any>,
    tokensList$: Observable<any>,
    dexesList$: Observable<any>,
    versionsList$: Observable<any>,
  ) {
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
        chainsList: chainsList$,
        tokensList: tokensList$,
        dexesList: dexesList$,
        versionsList: versionsList$,
        form: {
          chainId: null,
          versionId: null,
          token: null,
          token2: null,
          dexId: null,
          fee: null,
          poolAddress: '',
        }
      }
    }).afterClosed();
  }

  openEdit(
    row: any,
    chainsList$: Observable<any>,
    tokensList$: Observable<any>,
    dexesList$: Observable<any>,
    versionsList$: Observable<any>,
  ) {
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
        chainsList: chainsList$,
        tokensList: tokensList$,
        dexesList: dexesList$,
        versionsList: versionsList$,
        form: {
          poolId: row.poolId,
          chainId: row.chain.chainId,
          version: row.version,
          token: row.token.tokenId,
          token2: row.token2.tokenId,
          dexId: row.dex.dexId,
          fee: row.fee,
          poolAddress: row.poolAddress,
        }
      }
    }).afterClosed();
  }
}
