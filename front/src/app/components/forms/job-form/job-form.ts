import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IJobs } from '../../../models/db-config';

@Component({
  selector: 'app-job-form',
  imports: [],
  templateUrl: './job-form.html',
  styleUrl: './job-form.scss',
})
export class JobForm {
  @Input() formData!: IJobs;

  @Output() emitter = new EventEmitter();

  events(event: any, field: 'chainId' | 'name') {
    this.formData = {
      ...this.formData,
      [field]: event.data,
    };

    this.emitter.emit(this.formData);
  };
}
