import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IServers } from '../../../models/db-config';
import { FieldTitle } from '../../field-title/field-title';
import { HeaderContentLayout } from '../../layouts/header-content-layout/header-content-layout';
import { InputField } from '../../input-field/input-field';

@Component({
  selector: 'app-server-form',
  imports: [
    FieldTitle,
    HeaderContentLayout,
    InputField,
  ],
  templateUrl: './server-form.html',
  styleUrl: './server-form.scss',
})
export class ServerForm {
  @Input() formData!: IServers;

  @Output() emitter = new EventEmitter();

  events(event: any, field: 'ip' | 'port' | 'serverName') {
    this.formData = {
      ...this.formData,
      [field]: event.data,
    };

    this.emitter.emit(this.formData);
  };
}
