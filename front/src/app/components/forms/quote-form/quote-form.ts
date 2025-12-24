import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IQuotes } from '../../../models/db-config';

@Component({
  selector: 'app-quote-form',
  imports: [],
  templateUrl: './quote-form.html',
  styleUrl: './quote-form.scss',
})
export class QuoteForm {
  @Input() formData!: IQuotes;

  @Output() emitter = new EventEmitter();

  events(event: any, field: 'chainId' | 'name') {
    this.formData = {
      ...this.formData,
      [field]: event.data,
    };

    this.emitter.emit(this.formData);
  };
}
