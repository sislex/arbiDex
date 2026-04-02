import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ConfirmationPopUp } from '../../../components/confirmation-pop-up/confirmation-pop-up';
import { CexChainForm } from '../../../components/forms/cex-chain-form/cex-chain-form';

@Component({
  selector: 'app-cex-chain-form-container',
  imports: [
    ConfirmationPopUp,
    CexChainForm,
  ],
  templateUrl: './cex-chain-form-container.html',
  styleUrl: './cex-chain-form-container.scss',
})
export class CexChainFormContainer {
  private dialogRef = inject(MatDialogRef<CexChainFormContainer>);
  public data = inject(MAT_DIALOG_DATA);

  formData = {
    ...this.data.form
  }

  eventsForm($event: any) {
    this.formData = { ...$event };
    console.log(this.formData)

  }

  eventClose($event: any) {
    let data = {
      ...$event,
      formData: this.formData
    }
    this.dialogRef.close(data);
  }
}
