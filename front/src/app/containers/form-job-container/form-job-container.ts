import { Component } from '@angular/core';
import {FormJob} from '../../components/form-job/form-job';

@Component({
  selector: 'app-form-job-container',
  imports: [
    FormJob
  ],
  templateUrl: './form-job-container.html',
  styleUrl: './form-job-container.scss',
})
export class FormJobContainer {

}
