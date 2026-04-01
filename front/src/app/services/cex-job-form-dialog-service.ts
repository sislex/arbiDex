import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {CexJobFormContainer} from '../containers/forms/cex-job-form-container/cex-job-form-container';

@Injectable({
  providedIn: 'root',
})
export class CexJobDialogService {
  private dialog = inject(MatDialog);
  openCreate() {
    return this.dialog.open(CexJobFormContainer, {
      width: '90%',
      height: '90%',
      maxWidth: '100%',
      minHeight: '400px',
      minWidth: '600px',
      panelClass: 'custom-dialog-container',
      data: {
        title: 'Add new job',
        buttons: ['add', 'cancel'],
        form: {
          jobId: null,
          jobType: '',
          description: '',
          source: null,
          token0: null,
          token1: null
        }
      }
    }).afterClosed();
  }

  openEdit(row: any) {
    return this.dialog.open(CexJobFormContainer, {
      width: '90%',
      height: '90%',
      maxWidth: '100%',
      minHeight: '400px',
      minWidth: '600px',
      panelClass: 'custom-dialog-container',
      data: {
        title: 'Edit job',
        buttons: ['save', 'cancel'],
        form: {
          jobId: row.jobId,
          jobType: row.jobType,
          description: row.description,
          source: row.source,
          token0: row.token0,
          token1: row.token1
        }
      }
    }).afterClosed();
  }

}
