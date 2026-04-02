import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { FieldTitle } from '../../field-title/field-title';
import { HeaderContentLayout } from '../../layouts/header-content-layout/header-content-layout';
import { IPoolsCreate } from '../../../models/db-config';
import {Autocomplete} from '../../autocomplete/autocomplete';
import {InputField} from '../../input-field/input-field';

@Component({
  selector: 'app-cex-pair-form',
  imports: [
    AsyncPipe,
    FieldTitle,
    HeaderContentLayout,
    Autocomplete,
    InputField,
  ],
  templateUrl: './cex-pair-form.html',
  styleUrl: './cex-pair-form.scss',
})
export class CexPairForm implements OnInit {
  @Input() formData!: IPoolsCreate;
  @Input() chainsList: any = [];

  @Output() emitter = new EventEmitter();

  ngOnInit() {
    this.emitter.emit(this.formData);
  }

  events(event: any, field: 'source' | 'token0' | 'token1') {
    this.formData = {
      ...this.formData,
      [field]: event.data,
    };
    this.emitter.emit(this.formData);
  };
}
