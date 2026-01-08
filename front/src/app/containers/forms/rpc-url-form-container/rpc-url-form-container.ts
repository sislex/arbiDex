import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ConfirmationPopUp } from '../../../components/confirmation-pop-up/confirmation-pop-up';
import { RpcUrlForm } from '../../../components/forms/rpc-url-form/rpc-url-form';
import { setChainsData } from '../../../+state/db-config/db-config.actions';
import { Store } from '@ngrx/store';
import { PoolForm } from '../../../components/forms/pool-form/pool-form';

@Component({
  selector: 'app-rpc-url-form-container',
  imports: [
    ConfirmationPopUp,
    RpcUrlForm,
    PoolForm,
  ],
  templateUrl: './rpc-url-form-container.html',
  styleUrl: './rpc-url-form-container.scss',
})
export class RpcUrlFormContainer {
  private dialogRef = inject(MatDialogRef<RpcUrlFormContainer>);
  public data = inject(MAT_DIALOG_DATA);
  public store = inject(Store);

  constructor() {
    this.store.dispatch(setChainsData());
  }

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
