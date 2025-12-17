import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { SelectField } from '../../select-field/select-field';
import { Store } from '@ngrx/store';
import { setChainsData } from '../../../+state/db-config/db-config.actions';
import { ITokens } from '../../../models/db-config';
import { HeaderContentLayout } from '../../layouts/header-content-layout/header-content-layout';
import { FieldTitle } from '../../field-title/field-title';
import { InputField } from '../../input-field/input-field';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-token-form',
  imports: [
    HeaderContentLayout,
    FieldTitle,
    SelectField,
    InputField,
    AsyncPipe,
  ],
  templateUrl: './token-form.html',
  styleUrl: './token-form.scss',
})
export class TokenForm implements OnInit {
  @Input() formData!: ITokens;
  @Input() list: any = [];

  @Output() emitter = new EventEmitter();

  private store = inject(Store);

  ngOnInit() {
    this.store.dispatch(setChainsData());
  };

  events(event: any, field: 'chainId' | 'address' | 'symbol' | 'decimals' | 'tokenName') {
    this.formData = {
      ...this.formData,
      [field]: event.data,
    };

    this.emitter.emit(this.formData);
  };

}
