import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { JobFormContainer } from '../containers/forms/job-form-container/job-form-container';

@Injectable({
  providedIn: 'root',
})
export class JobDialogService {
  private dialog = inject(MatDialog);
  openCreate() {
    return this.dialog.open(JobFormContainer, {
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
          chainId: null,
          rpcUrlId: null
        }
      }
    }).afterClosed();
  }

  openEdit(row: any) {
    return this.dialog.open(JobFormContainer, {
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
          chainId: row.chainId,
          rpcUrlId: row.rpcUrlId,
          extraSettings: row.extraSettings,
        }
      }
    }).afterClosed();
  }

}
