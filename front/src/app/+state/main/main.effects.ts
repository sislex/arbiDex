import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as MainActions from './main.actions';
import { tap, withLatestFrom } from 'rxjs';
import { Store } from '@ngrx/store';
import { getJobRelations } from '../relations/relations.selectors';
import { IArbitrumMultiQuoteJob } from '../../models/main';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class MainEffects {
  private actions$ = inject(Actions);
  private store = inject(Store);
  private _snackBar = inject(MatSnackBar);

  createJobConfig$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(MainActions.getJobConfig),
        withLatestFrom(this.store.select(getJobRelations)),
        tap(([_, jobData]) => {
          const jobConfig: IArbitrumMultiQuoteJob = {
            jobType: jobData[0].job.jobType,
            rpcUrl: 'https://arb1.arbitrum.io/rpc',
            pairsToQuote: jobData.map(item => ({
              dex: item.quote.pair.pool.dex.name,
              version: item.quote.pair.pool.version as "v2" | "v3" | "v4",
              token0: {
                address: item.quote.pair.pool.token.address,
                decimals: item.quote.pair.pool.token.decimals ?? 0
              },
              token1: {
                address: item.quote.pair.pool.token2.address,
                decimals: item.quote.pair.pool.token2.decimals ?? 0
              },
              poolAddress: String(item.quote.pair.pool.poolAddress),
              feePpm: item.quote.pair.pool.fee,
              tokenIn: {
                address: item.quote.pair.tokenIn.address,
                decimals: item.quote.pair.tokenIn.decimals ?? 0
              },
              tokenOut: {
                address: item.quote.pair.tokenOut.address,
                decimals: item.quote.pair.tokenOut.decimals ?? 0
              },
              side: item.quote.quote.side,
              amount: String(item.quote.quote.amount),
              blockTag: item.quote.quote.blockTag,
              quoteSource: item.quote.quote.quoteSource,
              createdAt: item.quote.quote.createdAt || ''
            }))
          };
          const configString = JSON.stringify(jobConfig, null, 2);

          navigator.clipboard.writeText(configString)
            .then(() => {
              this._snackBar.open('Config has been copied', 'OK', { duration: 5000 });
            })
            .catch(err => {
              console.error('Could not copy config: ', err);
              this._snackBar.open('Copy failed', 'Error', { duration: 3000 });
            });

          console.log('jobConfig', jobConfig)
        })
      ),
    { dispatch: false }
  );
}
