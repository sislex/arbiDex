import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FieldTitle } from '../../field-title/field-title';
import { HeaderContentLayout } from '../../layouts/header-content-layout/header-content-layout';
import { InputField } from '../../input-field/input-field';
import { IChains } from '../../../models/db-config';

@Component({
  selector: 'app-chain-form',
  imports: [
    FieldTitle,
    HeaderContentLayout,
    InputField,
  ],
  templateUrl: './chain-form.html',
  styleUrl: './chain-form.scss',
})
export class ChainForm {
  @Input() formData!: IChains;

  @Output() emitter = new EventEmitter();

  events(event: any, field: 'chainId' | 'name') {
    this.formData = {
      ...this.formData,
      [field]: event.data,
    };

    this.emitter.emit(this.formData);
  };
}
