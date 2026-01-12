import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FieldTitle } from '../../field-title/field-title';
import { HeaderContentLayout } from '../../layouts/header-content-layout/header-content-layout';
import { InputField } from '../../input-field/input-field';
import { AsyncPipe } from '@angular/common';
import { SelectField } from '../../select-field/select-field';

@Component({
  selector: 'app-job-form',
  imports: [
    FieldTitle,
    HeaderContentLayout,
    InputField,
    AsyncPipe,
    SelectField,
  ],
  templateUrl: './job-form.html',
  styleUrl: './job-form.scss',
})
export class JobForm {
  @Input() formData!: any;
  @Input() chainsList: any = [];
  @Input() rpcUrlList: any = [];

  @Output() emitter = new EventEmitter();

  events(event: any, field: 'jobType' | 'chainId'| 'rpcUrlId') {
    this.formData = {
      ...this.formData,
      [field]: event.data,
    };

    this.emitter.emit(this.formData);
  };
}
