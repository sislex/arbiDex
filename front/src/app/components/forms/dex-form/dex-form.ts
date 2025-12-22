import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FieldTitle } from '../../field-title/field-title';
import { HeaderContentLayout } from '../../layouts/header-content-layout/header-content-layout';
import { InputField } from '../../input-field/input-field';
import { IDexes } from '../../../models/db-config';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-dex-form',
  imports: [
    FieldTitle,
    HeaderContentLayout,
    InputField,
    ReactiveFormsModule,
  ],
  templateUrl: './dex-form.html',
  styleUrl: './dex-form.scss',
})
export class DexForm {
  @Input() formData!: IDexes;

  @Output() emitter = new EventEmitter();

  events(event: any, field: 'name') {
    this.formData = {
      ...this.formData,
      [field]: event.data,
    };

    this.emitter.emit(this.formData);
  };
}
