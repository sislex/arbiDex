import {Component, inject, Input} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {poolImportCamelotV3, setFee, tokenImportCamelotV3} from '../../../+state/main/main.actions';
import {Store} from '@ngrx/store';

@Component({
  selector: 'app-imports-page',
  imports: [
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './imports-page.html',
  styleUrl: './imports-page.scss',
})
export class ImportsPage {
  @Input() data: string = '';

  private store = inject(Store)

  events(note: string) {
    if (note === 'token') {
      this.store.dispatch(tokenImportCamelotV3({data: this.data}));
    } else if (note === 'pool') {
      this.store.dispatch(poolImportCamelotV3({data: this.data}));
    } else if (note === 'setfee') {
      this.store.dispatch(setFee());

    }
  }
}
