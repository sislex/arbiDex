import {Component, inject, Input} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {setFee} from '../../../+state/main/main.actions';
import {Store} from '@ngrx/store';
import {ApiService} from '../../../services/api-service';

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
  private apiService = inject(ApiService);

  private store = inject(Store)

  async events(note: string) {
    if (note === 'token') {
      this.apiService.blockchain().subscribe({
        next: res => {
          console.log('Response from the server:', res);
        },
        error: err => {
          console.error('Error calling blockchain:', err);
        }
      });

    } else if (note === 'pool') {
      console.log('Pool получаем на бэке');
    } else if (note === 'setfee') {
      this.store.dispatch(setFee());
    } else if (note === 'getReserves') {
      console.log('Резервы получаем на бэке');
    }
  }
}
