import {Component, EventEmitter, Input, Output} from '@angular/core';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {UpperCasePipe} from '@angular/common';

@Component({
  selector: 'app-confirmation-pop-up',
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    UpperCasePipe,
  ],
  standalone: true,
  templateUrl: './confirmation-pop-up.html',
  styleUrl: './confirmation-pop-up.scss'
})
export class ConfirmationPopUp {
  @Input() title: string = '';
  @Input() buttons: string[] = [];

  @Output() emitter = new EventEmitter();
  event($event: any) {
    this.emitter.emit({
      event: 'ConfirmationPopUp:RESULT_CLICKED',
      data: $event
    });
  }
}
