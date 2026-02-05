import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IQuotesCreate } from '../../../models/db-config';
import { FieldTitle } from '../../field-title/field-title';
import { HeaderContentLayout } from '../../layouts/header-content-layout/header-content-layout';
import { InputField } from '../../input-field/input-field';
import {AsyncPipe} from '@angular/common';
import {Autocomplete} from '../../autocomplete/autocomplete';

@Component({
  selector: 'app-quote-form',
  imports: [
    FieldTitle,
    HeaderContentLayout,
    InputField,
    AsyncPipe,
    Autocomplete,
  ],
  templateUrl: './quote-form.html',
  styleUrl: './quote-form.scss',
})
export class QuoteForm {
  @Input() formData!: IQuotesCreate;
  @Input() tokensList: any = [];

  @Output() emitter = new EventEmitter();

  events(event: any, field: 'amount' | 'side' | 'blockTag' | 'quoteSource' | 'token') {
    this.formData = {
      ...this.formData,
      [field]: event.data,
    };

    this.emitter.emit(this.formData);
  };
}
