import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ConfirmationPopUp } from '../../../components/confirmation-pop-up/confirmation-pop-up';
import { setChainsData, setRpcUrlsData } from '../../../+state/db-config/db-config.actions';
import { Store } from '@ngrx/store';
import {
  getCexPairsFullData
} from '../../../+state/db-config/db-config.selectors';
import { map } from 'rxjs';
import {CexJobForm} from '../../../components/forms/cex-job-form/cex-job-form';

@Component({
  selector: 'app-cex-job-form-container',
  imports: [
    ConfirmationPopUp,
    CexJobForm,
  ],
  templateUrl: './cex-job-form-container.html',
  styleUrl: './cex-job-form-container.scss',
})
export class CexJobFormContainer {
  private dialogRef = inject(MatDialogRef<CexJobFormContainer>);
  public data = inject(MAT_DIALOG_DATA);
  public store = inject(Store);

  formData = {
    ...this.data.form
  }

  chainsList$ = this.store.select(getCexPairsFullData).pipe(
    map(item =>
      item.map(item => ({
        id: item.id,
        name: item.sourceName,
        address: item.token0 + '/' + item.token1,
      }))
    )
  );
  constructor() {
    this.store.dispatch(setChainsData());
    this.store.dispatch(setRpcUrlsData());
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
