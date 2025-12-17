import { Component, inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MarketForm } from '../../../components/forms/market-form/market-form';
import { ConfirmationPopUp } from '../../../components/confirmation-pop-up/confirmation-pop-up';
import { Store } from '@ngrx/store';
import { setPoolsData } from '../../../+state/db-config/db-config.actions';

@Component({
  selector: 'app-market-form-container',
  imports: [
    ConfirmationPopUp,
    MarketForm,
  ],
  templateUrl: './market-form-container.html',
  styleUrl: './market-form-container.scss',
})
export class MarketFormContainer implements OnInit {
  private dialogRef = inject(MatDialogRef<MarketFormContainer>);
  public data = inject(MAT_DIALOG_DATA);

  formData = {
    ...this.data.form
  }

  private store = inject(Store);

  ngOnInit() {
    this.store.dispatch(setPoolsData());
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
