import { Component, inject, OnInit } from '@angular/core';
import { ConfirmationPopUp } from '../../../components/confirmation-pop-up/confirmation-pop-up';
import { PoolForm } from '../../../components/forms/pool-form/pool-form';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { setChainsData, setDexesData, setTokensData } from '../../../+state/db-config/db-config.actions';

@Component({
  selector: 'app-pool-form-container',
  imports: [
    ConfirmationPopUp,
    PoolForm,
  ],
  templateUrl: './pool-form-container.html',
  styleUrl: './pool-form-container.scss',
})
export class PoolFormContainer implements OnInit {
  private dialogRef = inject(MatDialogRef<PoolFormContainer>);
  public data = inject(MAT_DIALOG_DATA);

  formData = {
    ...this.data.form
  }

  private store = inject(Store);

  ngOnInit() {
    this.store.dispatch(setChainsData());
    this.store.dispatch(setTokensData());
    this.store.dispatch(setDexesData());
  };

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
