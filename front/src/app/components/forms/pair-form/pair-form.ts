import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IPairs, IPools } from '../../../models/db-config';
import { AsyncPipe } from '@angular/common';
import { FieldTitle } from '../../field-title/field-title';
import { HeaderContentLayout } from '../../layouts/header-content-layout/header-content-layout';
import { InputField } from '../../input-field/input-field';
import { SelectField } from '../../select-field/select-field';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-pair-form',
  imports: [
    AsyncPipe,
    FieldTitle,
    HeaderContentLayout,
    InputField,
    SelectField,
  ],
  templateUrl: './pair-form.html',
  styleUrl: './pair-form.scss',
})
export class PairForm {
  @Input() formData!: IPairs;
  @Input() poolList?: Observable<IPools>;

  @Output() emitter = new EventEmitter();

  events(event: any, field: 'poolId' | 'tokenIn' | 'tokenOut') {
    this.formData = {
      ...this.formData,
      [field]: event.data,
    };

    console.log(this.formData, 'На первое изменение надо получить token0 и token1 из pool который выбрал')

    this.emitter.emit(this.formData);
  };
}
