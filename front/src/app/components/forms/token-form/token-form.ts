import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { InputField } from '../../input-field/input-field';
import { SelectField } from '../../select-field/select-field';
import { Store } from '@ngrx/store';
import { setChainsData } from '../../../+state/db-config/db-config.actions';
import { AsyncPipe } from '@angular/common';
import { ITokens } from '../../../models/db-config';
import { HeaderContentLayout } from '../../layouts/header-content-layout/header-content-layout';
import { FieldTitle } from '../../field-title/field-title';

@Component({
  selector: 'app-token-form',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    InputField,
    SelectField,
    AsyncPipe,
    HeaderContentLayout,
    FieldTitle,
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
