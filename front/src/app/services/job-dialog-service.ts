import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { JobFormContainer } from '../containers/forms/job-form-container/job-form-container';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class JobDialogService {
  private dialog = inject(MatDialog);
  openCreate(
    chainsList$: Observable<any>,
  ) {
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
        chainsList: chainsList$,
        form: {
          jobId: null,
          jobType: ''
        }
      }
    }).afterClosed();
  }

  openEdit(row: any, chainsList$: Observable<any>) {
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
        chainsList: chainsList$,
        form: { ...row }
      }
    }).afterClosed();
  }

}
