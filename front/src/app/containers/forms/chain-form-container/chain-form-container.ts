import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ConfirmationPopUp } from '../../../components/confirmation-pop-up/confirmation-pop-up';
import { ChainForm } from '../../../components/forms/chain-form/chain-form';
import { TokenForm } from '../../../components/forms/token-form/token-form';

@Component({
  selector: 'app-chain-form-container',
  imports: [
    ConfirmationPopUp,
    ChainForm,
    TokenForm,
  ],
  templateUrl: './chain-form-container.html',
  styleUrl: './chain-form-container.scss',
})
export class ChainFormContainer {
  private dialogRef = inject(MatDialogRef<ChainFormContainer>);
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
