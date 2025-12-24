import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IPairsCreate, IPools, ISelectMenu } from '../../../models/db-config';
import { AsyncPipe } from '@angular/common';
import { FieldTitle } from '../../field-title/field-title';
import { HeaderContentLayout } from '../../layouts/header-content-layout/header-content-layout';
import { InputField } from '../../input-field/input-field';
import { SelectField } from '../../select-field/select-field';
import { Actions } from '../../actions/actions';
import { Observable, take, filter } from 'rxjs';
import { Loader } from '../../loader/loader';

@Component({
  selector: 'app-pair-form',
  imports: [
    AsyncPipe,
    FieldTitle,
    HeaderContentLayout,
    InputField,
    SelectField,
    Actions,
    Loader,
  ],
  templateUrl: './pair-form.html',
  styleUrl: './pair-form.scss',
})
export class PairForm implements OnInit {
  @Input() formData!: IPairsCreate;
  @Input() poolList?: any;
  @Input() poolsListResponse?: Observable<IPools[]>;

  @Output() emitter = new EventEmitter();

  poolTokens: ISelectMenu[] = [];

  ngOnInit() {
    if (this.formData?.poolId) {
      this.updatePoolData(this.formData.poolId);
    }
  }

  private updatePoolData(poolId: number) {
    this.poolsListResponse?.pipe(
      filter(pools => pools && pools.length > 0),
      take(1)
    ).subscribe(pools => {
      const selectedPool = pools.find((p: any) => p.poolId === poolId);

      if (selectedPool) {
        this.poolTokens = [
          { id: selectedPool.token.tokenId!, name: selectedPool.token.tokenName! },
          { id: selectedPool.token2.tokenId!, name: selectedPool.token2.tokenName! },
        ];

        this.formData = {
          ...this.formData,
          poolId: poolId,
          tokenIn: selectedPool.token.tokenId!,
          tokenOut: selectedPool.token2.tokenId!,
        };

        this.emitter.emit(this.formData);
      }
    });
  }

  events(event: any, field: 'poolId' | 'tokenIn' | 'tokenOut') {
    if (field === 'poolId') {
      this.formData = { ...this.formData, poolId: event.data };

      this.updatePoolData(event.data);
    }
  }

  swap() {
    this.formData = {
      ...this.formData,
      tokenIn: this.formData.tokenOut,
      tokenOut: this.formData.tokenIn
    };
    this.emitter.emit(this.formData);
  }
}
