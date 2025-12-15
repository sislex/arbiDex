import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Actions} from '../actions/actions';

@Component({
  selector: 'app-title-table-button',
  imports: [
    Actions
  ],
  templateUrl: './title-table-button.html',
  styleUrl: './title-table-button.scss',
})
export class TitleTableButton {
  @Input() title: string = '';
  @Input() icon: string = '';
  @Input() typeIcon = 'default';

  @Output() emitter = new EventEmitter();

  onAction($event: any) {
    this.emitter.emit({
      event: $event.event,
    });
  }
}
