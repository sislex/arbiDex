import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ConfirmationPopUp } from '../../../components/confirmation-pop-up/confirmation-pop-up';
import { PairForm } from '../../../components/forms/pair-form/pair-form';

@Component({
  selector: 'app-pair-form-container',
  imports: [
    ConfirmationPopUp,
    PairForm,
  ],
  templateUrl: './pair-form-container.html',
  styleUrl: './pair-form-container.scss',
})
export class PairFormContainer {
  private dialogRef = inject(MatDialogRef<PairFormContainer>);
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
