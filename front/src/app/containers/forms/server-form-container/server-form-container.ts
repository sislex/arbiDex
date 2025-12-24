import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ConfirmationPopUp } from '../../../components/confirmation-pop-up/confirmation-pop-up';
import { ServerForm } from '../../../components/forms/server-form/server-form';

@Component({
  selector: 'app-server-form-container',
  imports: [
    ConfirmationPopUp,
    ServerForm,
  ],
  templateUrl: './server-form-container.html',
  styleUrl: './server-form-container.scss',
})
export class ServerFormContainer {
  private dialogRef = inject(MatDialogRef<ServerFormContainer>);
  public data = inject(MAT_DIALOG_DATA);

  formData = {
    ...this.data.form
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
