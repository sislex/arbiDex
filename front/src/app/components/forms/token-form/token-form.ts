import { Component, EventEmitter, Input, Output } from '@angular/core';
import { HeaderContentLayout } from '../../layouts/header-content-layout/header-content-layout';
import { FieldTitle } from '../../field-title/field-title';
import { InputField } from '../../input-field/input-field';
import { AsyncPipe } from '@angular/common';
import {Autocomplete} from '../../autocomplete/autocomplete';

@Component({
  selector: 'app-token-form',
  imports: [
    HeaderContentLayout,
    FieldTitle,
    InputField,
    AsyncPipe,
    Autocomplete,
  ],
  templateUrl: './token-form.html',
  styleUrl: './token-form.scss',
})
export class TokenForm {
  @Input() formData!: any;
  @Input() list: any = [];

  @Output() emitter = new EventEmitter();

  events(event: any, field: 'chainId' | 'address' | 'symbol' | 'decimals' | 'tokenName') {
    this.formData = {
      ...this.formData,
      [field]: event.data,
    };

    this.emitter.emit(this.formData);
  };

}
