import { Component, inject } from '@angular/core';
import { ConfirmationPopUp } from '../../../components/confirmation-pop-up/confirmation-pop-up';
import { BotForm } from '../../../components/forms/bot-form/bot-form';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { setServersData } from '../../../+state/db-config/db-config.actions';

@Component({
  selector: 'app-bot-form-container',
  imports: [
    ConfirmationPopUp,
    BotForm,
  ],
  templateUrl: './bot-form-container.html',
  styleUrl: './bot-form-container.scss',
})
export class BotFormContainer {
  private dialogRef = inject(MatDialogRef<BotFormContainer>);
  public data = inject(MAT_DIALOG_DATA);
  private store = inject(Store)

  formData = {
    ...this.data.form
  }

  constructor() {
    this.store.dispatch(setServersData());
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
