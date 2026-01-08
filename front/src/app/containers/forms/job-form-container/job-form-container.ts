import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ConfirmationPopUp } from '../../../components/confirmation-pop-up/confirmation-pop-up';
import { JobForm } from '../../../components/forms/job-form/job-form';
import { setChainsData } from '../../../+state/db-config/db-config.actions';
import { Store } from '@ngrx/store';
import { RpcUrlForm } from '../../../components/forms/rpc-url-form/rpc-url-form';

@Component({
  selector: 'app-job-form-container',
  imports: [
    ConfirmationPopUp,
    JobForm,
    RpcUrlForm,
  ],
  templateUrl: './job-form-container.html',
  styleUrl: './job-form-container.scss',
})
export class JobFormContainer {
  private dialogRef = inject(MatDialogRef<JobFormContainer>);
  public data = inject(MAT_DIALOG_DATA);
  public store = inject(Store);

  formData = {
    ...this.data.form
  }

  constructor() {
    this.store.dispatch(setChainsData());
  }

  eventsForm($event: any) {
    this.formData = { ...$event };
  }

  eventClose($event: any) {
    let data = {
      ...$event,
      formData: this.formData
    }
    this.dialogRef.close(data);
  }
}
