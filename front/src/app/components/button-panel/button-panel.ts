import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatToolbar } from '@angular/material/toolbar';
import { UpperCasePipe } from '@angular/common';

@Component({
  selector: 'app-button-panel',
  imports: [
    MatButton,
    MatToolbar,
    UpperCasePipe,
  ],
  templateUrl: './button-panel.html',
  styleUrl: './button-panel.scss',
})
export class ButtonPanel {
  @Input() buttons: string[] = [];
  @Input() disabled: boolean = true;

  @Output() emitter = new EventEmitter();
  event($event: any) {
    this.emitter.emit({
      event: 'ButtonPanel:BUTTON_CLICKED',
      data: $event
    });
  }
}
