import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IQuotes } from '../../../models/db-config';
import { AsyncPipe } from '@angular/common';
import { FieldTitle } from '../../field-title/field-title';
import { HeaderContentLayout } from '../../layouts/header-content-layout/header-content-layout';
import { InputField } from '../../input-field/input-field';
import { SelectField } from '../../select-field/select-field';

@Component({
  selector: 'app-quote-form',
  imports: [
    AsyncPipe,
    FieldTitle,
    HeaderContentLayout,
    InputField,
    SelectField,
  ],
  templateUrl: './quote-form.html',
  styleUrl: './quote-form.scss',
})
export class QuoteForm {
  @Input() formData!: IQuotes;

  @Output() emitter = new EventEmitter();

  events(event: any, field: 'amount' | 'side' | 'blockTag' | 'quoteSource') {
    this.formData = {
      ...this.formData,
      [field]: event.data,
    };

    this.emitter.emit(this.formData);
  };
}
