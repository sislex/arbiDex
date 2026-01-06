import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as MainActions from './main.actions';
import { tap } from 'rxjs';
import { IArbitrumMultiQuoteJob } from '../../models/main';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfigDialogService } from '../../services/config-dialog-service';

@Injectable()
export class MainEffects {
  private actions$ = inject(Actions);
  private _snackBar = inject(MatSnackBar);
  private configDialogService = inject(ConfigDialogService);

  setPreConfig$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(MainActions.setPreConfig),
        tap((data: any) => {
          console.log(data.data)
          const jobConfig: IArbitrumMultiQuoteJob = {
            // jobType: jobData[0].job.jobType || 0,
            jobType: '1',
            rpcUrl: 'https://arb1.arbitrum.io/rpc',
            pairsToQuote: data.data.map((item: any) => ({
              dex: item.pair.pool.dex.name,
              version: item.pair.pool.version as "v2" | "v3" | "v4",
              token0: {
                address: item.pair.pool.token.address,
                decimals: item.pair.pool.token.decimals ?? 0
              },
              token1: {
                address: item.pair.pool.token2.address,
                decimals: item.pair.pool.token2.decimals ?? 0
              },
              poolAddress: String(item.pair.pool.poolAddress),
              feePpm: item.pair.pool.fee,
              tokenIn: {
                address: item.pair.tokenIn.address,
                decimals: item.pair.tokenIn.decimals ?? 0
              },
              tokenOut: {
                address: item.pair.tokenOut.address,
                decimals: item.pair.tokenOut.decimals ?? 0
              },
              side: item.quote.side,
              amount: String(item.quote.amount),
              blockTag: item.quote.blockTag,
              quoteSource: item.quote.quoteSource,
            }))
          };
          const configString = JSON.stringify(jobConfig, null, 2);
          const configTitle = 'Copy Job config'
          this.configDialogService.openConfig(configTitle, configString);
        })
      ),
    { dispatch: false }
  );

  copyConfig$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(MainActions.copyConfig),
        tap((action: any) => {
          navigator.clipboard.writeText(action.config)
            .then(() => {
              this._snackBar.open('Config has been copied', 'OK', { duration: 5000 });
            })
            .catch(err => {
              console.error('Could not copy config: ', err);
              this._snackBar.open('Copy failed', 'Error', { duration: 3000 });
            });
        })
      ),
    { dispatch: false }
  );
}
