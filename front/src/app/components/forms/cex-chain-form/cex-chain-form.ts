import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FieldTitle } from '../../field-title/field-title';
import { HeaderContentLayout } from '../../layouts/header-content-layout/header-content-layout';
import { InputField } from '../../input-field/input-field';

@Component({
  selector: 'app-cex-chain-form',
  imports: [
    FieldTitle,
    HeaderContentLayout,
    InputField,
  ],
  templateUrl: './cex-chain-form.html',
  styleUrl: './cex-chain-form.scss',
})
export class CexChainForm {
  @Input() formData!: any;

  @Output() emitter = new EventEmitter();

  events(event: any, field: 'newChainId' | 'name') {
    this.formData = {
      ...this.formData,
      [field]: event.data,
    };

    this.emitter.emit(this.formData);
  };
}
