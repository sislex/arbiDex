import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ConfirmationPopUp } from '../../../components/confirmation-pop-up/confirmation-pop-up';
import { DexForm } from '../../../components/forms/dex-form/dex-form';

@Component({
  selector: 'app-dex-form-container',
  imports: [
    ConfirmationPopUp,
    DexForm,
  ],
  templateUrl: './dex-form-container.html',
  styleUrl: './dex-form-container.scss',
})
export class DexFormContainer {

  private dialogRef = inject(MatDialogRef<DexFormContainer>);
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
