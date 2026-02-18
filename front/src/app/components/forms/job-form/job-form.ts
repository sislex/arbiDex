import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FieldTitle } from '../../field-title/field-title';
import { HeaderContentLayout } from '../../layouts/header-content-layout/header-content-layout';
import { InputField } from '../../input-field/input-field';
import { AsyncPipe } from '@angular/common';
import {Autocomplete} from '../../autocomplete/autocomplete';
import {InputTextArea} from '../../input-text-area/input-text-area';

@Component({
  selector: 'app-job-form',
  imports: [
    FieldTitle,
    HeaderContentLayout,
    InputField,
    AsyncPipe,
    Autocomplete,
    InputTextArea,
  ],
  templateUrl: './job-form.html',
  styleUrl: './job-form.scss',
})
export class JobForm implements OnInit {
  @Input() formData!: any;
  @Input() chainsList: any = [];
  @Input() rpcUrlList: any = [];
  @Input() rpcUrlDisabled: boolean = true;

  @Output() emitter = new EventEmitter();
  extraSettings: string = '';
  ngOnInit() {
    this.emitter.emit(this.formData);
    this.extraSettings = JSON.stringify(JSON.parse(this.formData.extraSettings), null, 2);
  }

  events(event: any, field: 'jobType' | 'chainId' | 'rpcUrlId' | 'description' | 'extraSettings') {
    this.formData = {
      ...this.formData,
      [field]: event.data,
    };

    this.emitter.emit(this.formData);
  };
}
