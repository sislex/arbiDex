import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as MainActions from './main.actions';
import {catchError, EMPTY, from, switchMap, tap} from 'rxjs';
import { IArbitrumMultiQuoteJob } from '../../models/main';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfigDialogService } from '../../services/config-dialog-service';
import { ApiService } from '../../services/api-service';
import { concatLatestFrom } from '@ngrx/operators';
import {Store} from '@ngrx/store';
import {getBotsByServerIdResponse} from '../db-config/db-config.selectors';

@Injectable()
export class MainEffects {
  private actions$ = inject(Actions);
  private _snackBar = inject(MatSnackBar);
  private configDialogService = inject(ConfigDialogService);
  private apiService = inject(ApiService);
  private store = inject(Store);

  setJobPreConfig$ = createEffect(() =>
      this.actions$.pipe(
        ofType(MainActions.setJobPreConfig),
        switchMap((data: any) =>
          from(this.apiService.getJobById(data.jobId)).pipe(
            tap((jobData) => {
              const jobConfig: IArbitrumMultiQuoteJob = {
                jobType: jobData.jobType,
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
              const configTitle = 'Copy Job config';
              this.configDialogService.openConfig(configTitle, configString);
            }),
            catchError(err => {
              console.error('Failed to load job data', err);
              return EMPTY;
            })
          )
        )
      ),
    { dispatch: false }
  );


  setBotPreConfig$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(MainActions.setBotPreConfig),
        switchMap((data: any) =>
          from(this.apiService.setBotById(data.botId)).pipe(
            tap((botData: any) => {
              const jobConfig = {
                jobType: data.data[0].jobType,
                rpcUrl: 'https://arb1.arbitrum.io/rpc',
                pairsToQuote: data.data[0].quoteJobRelations.map((item: any) => ({
                  dex: item.quoteRelation.pair.pool.dex.name,
                  version: item.quoteRelation.pair.pool.version as "v2" | "v3" | "v4",
                  token0: {
                    address: item.quoteRelation.pair.pool.token.address,
                    decimals: item.quoteRelation.pair.pool.token.decimals ?? 0
                  },
                  token1: {
                    address: item.quoteRelation.pair.pool.token2.address,
                    decimals: item.quoteRelation.pair.pool.token2.decimals ?? 0
                  },
                  poolAddress: String(item.quoteRelation.pair.pool.poolAddress),
                  feePpm: item.quoteRelation.pair.pool.fee,
                  tokenIn: {
                    address: item.quoteRelation.pair.tokenIn.address,
                    decimals: item.quoteRelation.pair.tokenIn.decimals ?? 0
                  },
                  tokenOut: {
                    address: item.quoteRelation.pair.tokenOut.address,
                    decimals: item.quoteRelation.pair.tokenOut.decimals ?? 0
                  },
                  side: item.quoteRelation.quote.side,
                  amount: String(item.quoteRelation.quote.amount),
                  blockTag: item.quoteRelation.quote.blockTag,
                  quoteSource: item.quoteRelation.quote.quoteSource,
                }))
              };

              const botConfig = {
                botType: botData.botName,
                paused: botData.paused,
                isRepeat: botData.isRepeat,
                delayBetweenRepeat: botData.delayBetweenRepeat,
                maxJobs: botData.maxJobs,
                maxErrors: botData.maxErrors,
                timeoutMs: botData.timeoutMs,
                jobParams: jobConfig,
              };

              const configString = JSON.stringify(botConfig, null, 2);
              const configTitle = 'Copy Bot config';
              this.configDialogService.openConfig(configTitle, configString);
            }),
            catchError((err) => {
              console.error('Error fetching bot data:', err);
              return EMPTY;
            })
          )
        )
      ),
    { dispatch: false }
  );


  setServerPreConfig$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(MainActions.setServerPreConfig),
        concatLatestFrom(() => this.store.select(getBotsByServerIdResponse)),
        switchMap(([action, botsData]) =>
          from(this.apiService.setServerById(action.serverId)).pipe(
            tap((serverData: any) => {
              const botConfig = botsData.map((botData: any) => {
                const jobQuoteJobRelations = botData.job.quoteJobRelations.map((quoteRelation: any) => ({
                  dex: quoteRelation.quoteRelation.pair.pool.dex.name,
                  version: quoteRelation.quoteRelation.pair.pool.version,
                  token0: {
                    address: quoteRelation.quoteRelation.pair.pool.token.address,
                    decimals: quoteRelation.quoteRelation.pair.pool.token.decimals ?? 0
                  },
                  token1: {
                    address: quoteRelation.quoteRelation.pair.pool.token2.address,
                    decimals: quoteRelation.quoteRelation.pair.pool.token2.decimals ?? 0
                  },
                  poolAddress: String(quoteRelation.quoteRelation.pair.pool.poolAddress),
                  feePpm: quoteRelation.quoteRelation.pair.pool.fee,
                  tokenIn: {
                    address: quoteRelation.quoteRelation.pair.tokenIn.address,
                    decimals: quoteRelation.quoteRelation.pair.tokenIn.decimals ?? 0
                  },
                  tokenOut: {
                    address: quoteRelation.quoteRelation.pair.tokenOut.address,
                    decimals: quoteRelation.quoteRelation.pair.tokenOut.decimals ?? 0
                  },
                  side: quoteRelation.quoteRelation.quote.side,
                  amount: String(quoteRelation.quoteRelation.quote.amount),
                  blockTag: quoteRelation.quoteRelation.quote.blockTag,
                  quoteSource: quoteRelation.quoteRelation.quote.quoteSource,
                }));

                return {
                  botType: botData.botName,
                  paused: botData.paused,
                  isRepeat: botData.isRepeat,
                  delayBetweenRepeat: botData.delayBetweenRepeat,
                  maxJobs: botData.maxJobs,
                  maxErrors: botData.maxErrors,
                  timeoutMs: botData.timeoutMs,
                  jobParams: {
                    jobType: botData.job.jobType,
                    rpcUrl: 'https://arb1.arbitrum.io',
                    pairsToQuote: jobQuoteJobRelations
                  }
                };
              });

              const serverConfig = { botList: botConfig };
              this.configDialogService.openConfig('Copy Bot config', JSON.stringify(serverConfig, null, 2));
            }),
            catchError((err) => {
              console.error('Error:', err);
              return EMPTY;
            })
          )
        )
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
