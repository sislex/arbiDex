import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IServers } from '../../../models/db-config';

@Component({
  selector: 'app-server-form',
  imports: [],
  templateUrl: './server-form.html',
  styleUrl: './server-form.scss',
})
export class ServerForm {
  @Input() formData!: IServers;

  @Output() emitter = new EventEmitter();

  events(event: any, field: 'chainId' | 'name') {
    this.formData = {
      ...this.formData,
      [field]: event.data,
    };

    this.emitter.emit(this.formData);
  };
}
