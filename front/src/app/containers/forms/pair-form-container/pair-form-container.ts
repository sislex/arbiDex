import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ConfirmationPopUp } from '../../../components/confirmation-pop-up/confirmation-pop-up';
import { PairForm } from '../../../components/forms/pair-form/pair-form';
import {setPoolsData, setTokensData} from '../../../+state/db-config/db-config.actions';
import { Store } from '@ngrx/store';
import {getFullPoolsData } from '../../../+state/db-config/db-config.selectors';
import {map} from 'rxjs';

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
  public store = inject(Store);

  formData = {
    ...this.data.form
  }

  fullPoolsData$ = this.store.select(getFullPoolsData)

  poolsList$ = this.fullPoolsData$.pipe(
    map(items => items.map(item => ({
      id: item.poolId,
      name: item.poolAddress.toString(),
    })))
  );

  constructor() {
    this.store.dispatch(setPoolsData());
    this.store.dispatch(setTokensData());
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
