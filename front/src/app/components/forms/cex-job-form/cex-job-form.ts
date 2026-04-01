import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FieldTitle } from '../../field-title/field-title';
import { HeaderContentLayout } from '../../layouts/header-content-layout/header-content-layout';
import { InputField } from '../../input-field/input-field';
import { AsyncPipe } from '@angular/common';
import {Autocomplete} from '../../autocomplete/autocomplete';

@Component({
  selector: 'app-cex-job-form',
  imports: [
    FieldTitle,
    HeaderContentLayout,
    InputField,
    AsyncPipe,
    Autocomplete,
  ],
  templateUrl: './cex-job-form.html',
  styleUrl: './cex-job-form.scss',
})
export class CexJobForm implements OnInit {
  @Input() formData!: any;
  @Input() chainsList: any = [];
  @Input() rpcUrlList: any = [];
  @Input() rpcUrlDisabled: boolean = true;

  @Output() emitter = new EventEmitter();
  extraSettings: string = '';
  ngOnInit() {
    this.emitter.emit(this.formData);
    if (this.formData?.extraSettings) {
      try {
        this.extraSettings = JSON.stringify(JSON.parse(this.formData.extraSettings), null, 2);
      } catch (e) {
        this.extraSettings = this.formData.extraSettings;
      }
    }
  }


  events(event: any, field: 'jobType' | 'chainId' | 'rpcUrlId' | 'description' | 'extraSettings') {
    this.formData = {
      ...this.formData,
      [field]: event.data,
    };

    this.emitter.emit(this.formData);
  };
}
