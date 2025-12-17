import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { FieldTitle } from '../../field-title/field-title';
import { HeaderContentLayout } from '../../layouts/header-content-layout/header-content-layout';
import { InputField } from '../../input-field/input-field';
import { SelectField } from '../../select-field/select-field';
import { IPools } from '../../../models/db-config';
import { Store } from '@ngrx/store';
import { setChainsData, setDexesData, setTokensData } from '../../../+state/db-config/db-config.actions';

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
export class PoolForm implements OnInit {
  @Input() formData!: IPools;
  @Input() chainsList: any = [];
  @Input() tokensList: any = [];
  @Input() dexesList: any = [];
  @Input() versionsList: any = [];

  @Output() emitter = new EventEmitter();

  private store = inject(Store);

  ngOnInit() {
    this.store.dispatch(setChainsData());
    this.store.dispatch(setTokensData());
    this.store.dispatch(setDexesData());
  };

  events(event: any, field: 'chainId' | 'baseTokenId' | 'quoteTokenId' | 'fee' | 'dexId' | 'version' | 'poolAddress') {
    this.formData = {
      ...this.formData,
      [field]: event.data,
    };

    this.emitter.emit(this.formData);
  };
}
