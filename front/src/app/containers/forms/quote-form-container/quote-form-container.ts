import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ConfirmationPopUp } from '../../../components/confirmation-pop-up/confirmation-pop-up';
import { QuoteForm } from '../../../components/forms/quote-form/quote-form';
import {setTokensData} from '../../../+state/db-config/db-config.actions';
import {Store} from '@ngrx/store';
import {getTokensDataResponse} from '../../../+state/db-config/db-config.selectors';
import {map} from 'rxjs';

@Component({
  selector: 'app-quote-form-container',
  imports: [
    ConfirmationPopUp,
    QuoteForm,
  ],
  templateUrl: './quote-form-container.html',
  styleUrl: './quote-form-container.scss',
})
export class QuoteFormContainer {
  private dialogRef = inject(MatDialogRef<QuoteFormContainer>);
  public data = inject(MAT_DIALOG_DATA);
  public store = inject(Store);

  formData = {
    ...this.data.form
  }

  tokenList$ = this.store.select(getTokensDataResponse).pipe(
    map(item =>
      item.map(item => ({
        id: item.tokenId,
        name: item.tokenName,
      }))
    )
  );

  constructor() {
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
