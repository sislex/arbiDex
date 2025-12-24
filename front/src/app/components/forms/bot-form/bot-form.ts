import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IBots } from '../../../models/db-config';

@Component({
  selector: 'app-bot-form',
  imports: [],
  templateUrl: './bot-form.html',
  styleUrl: './bot-form.scss',
})
export class BotForm {
  @Input() formData!: IBots;

  @Output() emitter = new EventEmitter();

  events(event: any, field: 'chainId' | 'name') {
    this.formData = {
      ...this.formData,
      [field]: event.data,
    };

    this.emitter.emit(this.formData);
  };
}
