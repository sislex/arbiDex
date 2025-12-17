import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FieldTitle } from '../../field-title/field-title';
import { HeaderContentLayout } from '../../layouts/header-content-layout/header-content-layout';
import { InputField } from '../../input-field/input-field';
import { IMarkets } from '../../../models/db-config';
import { AsyncPipe } from '@angular/common';
import { SelectField } from '../../select-field/select-field';

@Component({
  selector: 'app-market-form',
  imports: [
    FieldTitle,
    HeaderContentLayout,
    InputField,
    AsyncPipe,
    SelectField,
  ],
  templateUrl: './market-form.html',
  styleUrl: './market-form.scss',
})
export class MarketForm {
  @Input() formData!: IMarkets;
  @Input() list: any = [];

  @Output() emitter = new EventEmitter();

  events(event: any, field: 'poolId' | 'amount') {
    this.formData = {
      ...this.formData,
      [field]: event.data,
    };

    this.emitter.emit(this.formData);
  };
}
