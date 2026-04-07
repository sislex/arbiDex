import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IBotsCreate } from '../../../models/db-config';
import { FieldTitle } from '../../field-title/field-title';
import { HeaderContentLayout } from '../../layouts/header-content-layout/header-content-layout';
import { InputField } from '../../input-field/input-field';
import { AsyncPipe } from '@angular/common';
import { Toggle } from '../../toggle/toggle';
import {Autocomplete} from '../../autocomplete/autocomplete';

@Component({
  selector: 'app-bot-form',
  imports: [
    FieldTitle,
    HeaderContentLayout,
    InputField,
    AsyncPipe,
    Toggle,
    Autocomplete,
  ],
  templateUrl: './bot-form.html',
  styleUrl: './bot-form.scss',
})
export class BotForm {
  @Input() formData!: IBotsCreate;
  @Input() serversList?: any;
  @Input() jobList?: any;
  @Input() cexJobList?: any;
  @Input() jobTypes: any;

  @Output() emitter = new EventEmitter();

  events(
    event: any,
    field:
      | 'botName' | 'description' | 'jobId' | 'serverId' | 'paused'
      | 'isRepeat' | 'delayBetweenRepeat' | 'maxJobs' | 'maxErrors'
      | 'timeoutMs' | 'cexJobId' | 'jobType'
  ) {
    if (field === 'jobType') {
      this.formData = {
        ...this.formData,
        selectedType: event.data,
        jobId: null,
        cexJobId: null
      };
    } else {
      this.formData = {
        ...this.formData,
        [field]: event.data ?? event.id,
      };
    }

    this.emitter.emit(this.formData);
  }
}
