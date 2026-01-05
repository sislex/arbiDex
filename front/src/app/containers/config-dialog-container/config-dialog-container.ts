import { Component, inject, signal } from '@angular/core';
import { ConfirmationPopUp } from '../../components/confirmation-pop-up/confirmation-pop-up';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { InputField } from '../../components/input-field/input-field';
import { copyConfig } from '../../+state/main/main.actions';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-config-dialog-container',
  imports: [
    ConfirmationPopUp,
    InputField,
    FormsModule,
  ],
  templateUrl: './config-dialog-container.html',
  styleUrl: './config-dialog-container.scss',
})
export class ConfigDialogContainer {
  private dialogRef = inject(MatDialogRef<ConfigDialogContainer>);
  public data = inject(MAT_DIALOG_DATA);
  private store = inject(Store)

  configValue = signal<string>(this.data.configString || '');

  eventClose($event: any) {
    if ($event.data === 'copy all') {
      this.store.dispatch(copyConfig({ config: this.configValue() }));
    }

    let data = {
      ...$event,
      data: this.configValue()
    }
    this.dialogRef.close(data);
  }
}
