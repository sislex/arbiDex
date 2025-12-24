import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IPairs } from '../../../models/db-config';

@Component({
  selector: 'app-pair-form',
  imports: [],
  templateUrl: './pair-form.html',
  styleUrl: './pair-form.scss',
})
export class PairForm {
  @Input() formData!: IPairs;

  @Output() emitter = new EventEmitter();

  events(event: any, field: 'chainId' | 'name') {
    this.formData = {
      ...this.formData,
      [field]: event.data,
    };

    this.emitter.emit(this.formData);
  };
}
