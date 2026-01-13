import { Component, inject, signal } from '@angular/core';
import { ConfirmationPopUp } from '../../../components/confirmation-pop-up/confirmation-pop-up';
import { PoolForm } from '../../../components/forms/pool-form/pool-form';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { setChainsData, setDexesData, setTokensData } from '../../../+state/db-config/db-config.actions';
import {
  getChainsDataResponse, getDexesDataResponse,
  getTokensDataResponseFilterChainId, getVersionList,
} from '../../../+state/db-config/db-config.selectors';
import { map, switchMap } from 'rxjs';
import { toObservable } from '@angular/core/rxjs-interop';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-pool-form-container',
  imports: [
    ConfirmationPopUp,
    PoolForm,
    AsyncPipe,
  ],
  templateUrl: './pool-form-container.html',
  styleUrl: './pool-form-container.scss',
})
export class PoolFormContainer {
  private dialogRef = inject(MatDialogRef<PoolFormContainer>);
  public data = inject(MAT_DIALOG_DATA);
  private store = inject(Store);

  chainId = signal<number | null>(this.data.form.chainId);

  formData = {
    ...this.data.form
  }

  tokenDisabled$ = toObservable(this.chainId).pipe(
    map(id => !id)
  );

  tokensList$ = toObservable(this.chainId).pipe(
    switchMap(id => this.store.select(getTokensDataResponseFilterChainId(id || 0))),
    map(items => items?.map(i => ({ id: i.tokenId, name: i.tokenName })) || [])
  );

  chainsList$ = this.store.select(getChainsDataResponse).pipe(
    map(item =>
      item.map(item => ({
        id: item.chainId,
        name: item.name,
      }))
    )
  );

  dexesList$ = this.store.select(getDexesDataResponse).pipe(
    map(item =>
      item.map(item => ({
        id: item.dexId,
        name: item.name,
      }))
    )
  );

  versionList$ = this.store.select(getVersionList).pipe(
    map(item =>
      item.map(item => ({
        id: item,
        name: item,
      }))
    )
  );

  constructor() {
    this.store.dispatch(setChainsData());
    this.store.dispatch(setTokensData());
    this.store.dispatch(setDexesData());
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
