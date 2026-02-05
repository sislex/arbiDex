import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { FieldTitle } from '../../field-title/field-title';
import { HeaderContentLayout } from '../../layouts/header-content-layout/header-content-layout';
import { InputField } from '../../input-field/input-field';
import {Autocomplete} from '../../autocomplete/autocomplete';

@Component({
  selector: 'app-rpc-url-form',
  imports: [
    AsyncPipe,
    FieldTitle,
    HeaderContentLayout,
    InputField,
    Autocomplete,
  ],
  templateUrl: './rpc-url-form.html',
  styleUrl: './rpc-url-form.scss',
})
export class RpcUrlForm {
  @Input() formData!: any;
  @Input() chainsList: any = [];

  @Output() emitter = new EventEmitter();

  events(event: any, field: 'rpcUrl' | 'chainId') {
    this.formData = {
      ...this.formData,
      [field]: event.data,
    };

    this.emitter.emit(this.formData);
  };
}
