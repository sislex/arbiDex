import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { FieldTitle } from '../../field-title/field-title';
import { HeaderContentLayout } from '../../layouts/header-content-layout/header-content-layout';
import { InputField } from '../../input-field/input-field';
import { IPoolsCreate } from '../../../models/db-config';
import {Autocomplete} from '../../autocomplete/autocomplete';

@Component({
  selector: 'app-pool-form',
  imports: [
    AsyncPipe,
    FieldTitle,
    HeaderContentLayout,
    InputField,
    Autocomplete,
  ],
  templateUrl: './pool-form.html',
  styleUrl: './pool-form.scss',
})
export class PoolForm implements OnInit {
  @Input() formData!: IPoolsCreate;
  @Input() chainsList: any = [];
  @Input() tokensList: any = [];
  @Input() dexesList: any = [];
  @Input() versionsList: any = [];
  @Input() tokenDisabled: boolean = true;

  @Output() emitter = new EventEmitter();

  ngOnInit() {
    this.emitter.emit(this.formData);
  }

  events(event: any, field: 'chainId' | 'token' | 'token2' | 'fee' | 'dexId' | 'version' | 'poolAddress') {
    this.formData = {
      ...this.formData,
      [field]: event.data,
    };
    this.emitter.emit(this.formData);
  };
}
