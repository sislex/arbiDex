import { Component, inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ConfirmationPopUp } from '../../../components/confirmation-pop-up/confirmation-pop-up';
import { JobForm } from '../../../components/forms/job-form/job-form';
import { setChainsData, setRpcUrlsData } from '../../../+state/db-config/db-config.actions';
import { Store } from '@ngrx/store';
import {
  getChainsDataResponse,
  getRpcUrlDataResponseFilterChainId,
} from '../../../+state/db-config/db-config.selectors';
import { map, switchMap } from 'rxjs';
import { toObservable } from '@angular/core/rxjs-interop';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-job-form-container',
  imports: [
    ConfirmationPopUp,
    JobForm,
    AsyncPipe,
  ],
  templateUrl: './job-form-container.html',
  styleUrl: './job-form-container.scss',
})
export class JobFormContainer {
  private dialogRef = inject(MatDialogRef<JobFormContainer>);
  public data = inject(MAT_DIALOG_DATA);
  public store = inject(Store);

  chainId = signal<number | null>(this.data.form.chainId);

  formData = {
    ...this.data.form
  }

  rpcUrlDisabled$ = toObservable(this.chainId).pipe(
    map(id => !id)
  );

  chainsList$ = this.store.select(getChainsDataResponse).pipe(
    map(item =>
      item.map(item => ({
        id: item.chainId,
        name: item.name,
      }))
    )
  );

  rpcUrlList$ = toObservable(this.chainId).pipe(
    switchMap(id => this.store.select(getRpcUrlDataResponseFilterChainId(id || 0))),
    map(items => items?.map(i => ({
      id: i.rpcUrlId,
      name: i.rpcUrl
    })) || [])
  );


  constructor() {
    this.store.dispatch(setChainsData());
    this.store.dispatch(setRpcUrlsData());
  }

  eventsForm($event: any) {
    this.formData = { ...$event };
    this.chainId.set($event.chainId);
  }

  eventClose($event: any) {
    let data = {
      ...$event,
      formData: this.formData
    }
    this.dialogRef.close(data);
  }
}
