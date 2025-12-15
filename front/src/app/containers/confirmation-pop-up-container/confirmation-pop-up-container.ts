import {Component, inject} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';
import {ConfirmationPopUp} from '../../components/confirmation-pop-up/confirmation-pop-up';
import { MessageText } from '../../components/message-text/message-text';

@Component({
  selector: 'app-confirmation-pop-up-container',
  imports: [MatButtonModule, ConfirmationPopUp, MessageText],
  standalone: true,
  templateUrl: './confirmation-pop-up-container.html',
  styleUrl: './confirmation-pop-up-container.scss'
})
export class ConfirmationPopUpContainer {
  private dialogRef = inject(MatDialogRef<ConfirmationPopUpContainer>);
  public data = inject(MAT_DIALOG_DATA) as {
    title: string;
    message: string;
    buttons: string[];
  };

  events($event: any) {
    this.dialogRef.close($event);
  }
}
