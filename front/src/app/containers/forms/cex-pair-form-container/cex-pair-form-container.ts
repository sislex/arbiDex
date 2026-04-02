import { Component, inject } from '@angular/core';
import { ConfirmationPopUp } from '../../../components/confirmation-pop-up/confirmation-pop-up';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { setCexChainsData } from '../../../+state/db-config/db-config.actions';
import { getCexChainsDataResponse } from '../../../+state/db-config/db-config.selectors';
import { map } from 'rxjs';
import {CexPairForm} from '../../../components/forms/cex-pair-form/cex-pair-form';

@Component({
  selector: 'app-cex-pair-form-container',
  imports: [
    ConfirmationPopUp,
    CexPairForm,
  ],
  templateUrl: './cex-pair-form-container.html',
  styleUrl: './cex-pair-form-container.scss',
})
export class CexPairFormContainer {
  private dialogRef = inject(MatDialogRef<CexPairFormContainer>);
  public data = inject(MAT_DIALOG_DATA);
  private store = inject(Store);

  formData = {
    ...this.data.form
  }

  chainsList$ = this.store.select(getCexChainsDataResponse).pipe(
    map(item =>
      item.map(item => ({
        id: item.id,
        name: item.name,
      }))
    )
  );

  constructor() {
    this.store.dispatch(setCexChainsData());
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
