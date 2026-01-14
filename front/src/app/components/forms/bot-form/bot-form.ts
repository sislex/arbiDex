import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IBotsCreate, IJobs, IServers } from '../../../models/db-config';
import { FieldTitle } from '../../field-title/field-title';
import { HeaderContentLayout } from '../../layouts/header-content-layout/header-content-layout';
import { InputField } from '../../input-field/input-field';
import { AsyncPipe } from '@angular/common';
import { SelectField } from '../../select-field/select-field';
import { Observable } from 'rxjs';
import { Toggle } from '../../toggle/toggle';

@Component({
  selector: 'app-bot-form',
  imports: [
    FieldTitle,
    HeaderContentLayout,
    InputField,
    AsyncPipe,
    SelectField,
    Toggle,
  ],
  templateUrl: './bot-form.html',
  styleUrl: './bot-form.scss',
})
export class BotForm {
  @Input() formData!: IBotsCreate;
  @Input() serversList?: Observable<IServers>;
  @Input() jobList?: Observable<IJobs>;

  @Output() emitter = new EventEmitter();

  events(
    event: any,
    field:
      'botName' |
      'description' |
      'jobId' |
      'serverId' |
      'paused' |
      'isRepeat' |
      'delayBetweenRepeat' |
      'maxJobs' |
      'maxErrors' |
      'timeoutMs'
  ) {
    this.formData = {
      ...this.formData,
      [field]: event.data,
    };

    this.emitter.emit(this.formData);
  };
}
