import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { FieldTitle } from '../../field-title/field-title';
import { HeaderContentLayout } from '../../layouts/header-content-layout/header-content-layout';
import { InputField } from '../../input-field/input-field';
import { SelectField } from '../../select-field/select-field';
import { IPoolsCreate } from '../../../models/db-config';

@Component({
  selector: 'app-pool-form',
  imports: [
    AsyncPipe,
    FieldTitle,
    HeaderContentLayout,
    InputField,
    SelectField,
  ],
  templateUrl: './pool-form.html',
  styleUrl: './pool-form.scss',
})
export class PoolForm {
  @Input() formData!: IPoolsCreate;
  @Input() chainsList: any = [];
  @Input() tokensList: any = [];
  @Input() dexesList: any = [];
  @Input() versionsList: any = [];

  @Output() emitter = new EventEmitter();

  events(event: any, field: 'chainId' | 'token' | 'token2' | 'fee' | 'dexId' | 'version' | 'poolAddress') {
    this.formData = {
      ...this.formData,
      [field]: event.data,
    };
    console.log(this.formData )
    this.emitter.emit(this.formData);
  };
}
