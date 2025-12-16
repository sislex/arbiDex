import { Component, inject } from '@angular/core';
import { ConfirmationPopUp } from '../../../components/confirmation-pop-up/confirmation-pop-up';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TokenForm } from '../../../components/forms/token-form/token-form';

@Component({
  selector: 'app-token-form-container',
  imports: [
    ConfirmationPopUp,
    TokenForm,
  ],
  templateUrl: './token-form-container.html',
  styleUrl: './token-form-container.scss',
})
export class TokenFormContainer {
  private dialogRef = inject(MatDialogRef<TokenFormContainer>);
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
