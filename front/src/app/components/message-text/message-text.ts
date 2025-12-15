import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-message-text',
  imports: [],
  standalone: true,
  templateUrl: './message-text.html',
  styleUrl: './message-text.scss',
})
export class MessageText {
  @Input() message: string = '';

}
