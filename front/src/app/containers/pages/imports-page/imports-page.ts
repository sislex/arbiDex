import {Component, inject, Input} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {poolImportCamelotV3, setFee, tokenImportCamelotV3} from '../../../+state/main/main.actions';
import {Store} from '@ngrx/store';
import {Web3Service} from '../../../services/web3-service';
import {getPoolsDataResponse} from '../../../+state/db-config/db-config.selectors';
import {from, switchMap} from 'rxjs';

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
  private web3Service = inject(Web3Service)

  async events(note: string) {
    if (note === 'token') {
      this.store.dispatch(tokenImportCamelotV3({data: this.data}));
    } else if (note === 'pool') {
      this.store.dispatch(poolImportCamelotV3({data: this.data}));
    } else if (note === 'setfee') {
      this.store.dispatch(setFee());
    } else if (note === 'getReserves') {
      const poolsWithReserves$ = this.store.select(getPoolsDataResponse).pipe(
        switchMap(pools => {
          const addresses = pools.map(p => p.poolAddress as `0x${string}`);

          return from(this.web3Service.getAllPoolsData(addresses));
        })
      );

      poolsWithReserves$.subscribe(reserves => {
        console.log('Резервы получены:', reserves);
      });

    }
  }
}
