import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as MainActions from './main.actions';
import {catchError, EMPTY, from, switchMap, tap} from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfigDialogService } from '../../services/config-dialog-service';
import { ApiService } from '../../services/api-service';
import { concatLatestFrom } from '@ngrx/operators';
import {Store} from '@ngrx/store';
import {getBotsByServerIdResponse} from '../db-config/db-config.selectors';
import * as DbConfigSelectors from '../db-config/db-config.selectors';

export function mapQuoteRelation(item: any) {
  const qr = item.quoteRelation ?? item;

  return {
    dex: qr.pair.pool.dex.name,
    version: qr.pair.pool.version as 'v2' | 'v3' | 'v4',
    token0: {
      address: qr.pair.pool.token.address,
      decimals: qr.pair.pool.token.decimals ?? 0
    },
    token1: {
      address: qr.pair.pool.token2.address,
      decimals: qr.pair.pool.token2.decimals ?? 0
    },
    poolAddress: String(qr.pair.pool.poolAddress),
    feePpm: qr.pair.pool.fee,
    tokenIn: {
      address: qr.pair.tokenIn.address,
      decimals: qr.pair.tokenIn.decimals ?? 0
    },
    tokenOut: {
      address: qr.pair.tokenOut.address,
      decimals: qr.pair.tokenOut.decimals ?? 0
    },
    side: qr.quote.side,
    amount: String(qr.quote.amount),
    blockTag: qr.quote.blockTag,
    quoteSource: qr.quote.quoteSource,
  };
}

export function mapBotParams(botData: any) {
  return {
    botType: botData.botName,
    paused: botData.paused,
    isRepeat: botData.isRepeat,
    delayBetweenRepeat: botData.delayBetweenRepeat,
    maxJobs: botData.maxJobs,
    maxErrors: botData.maxErrors,
    timeoutMs: botData.timeoutMs,
  };
}

export function mapBotToRule(botData: any) {
  return {
    id: botData.botId,
    botParams: mapBotParams(botData),
    jobParams: mapJobParams(botData.job)
  };
}

export function mapJobParams(job: any) {
  return {
    jobType: job.jobType,
    rpcUrl: 'https://arb1.arbitrum.io/rpc',
    pairsToQuote: job.quoteJobRelations.map(mapQuoteRelation)
  };
}

export function mapJobPreConfig(jobData: any, relations: any[]) {
  return {
    jobType: jobData.jobType,
    rpcUrl: 'https://arb1.arbitrum.io/rpc',
    pairsToQuote: relations.map(mapQuoteRelation)
  };
}


@Injectable()
export class MainEffects {
  private actions$ = inject(Actions);
  private _snackBar = inject(MatSnackBar);
  private configDialogService = inject(ConfigDialogService);
  private apiService = inject(ApiService);
  private store = inject(Store);

  setJobPreConfig$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(MainActions.setJobPreConfig),
        switchMap((action: any) =>
          from(this.apiService.getJobById(action.jobId)).pipe(
            tap((jobData) => {
              const jobConfig = mapJobPreConfig(jobData, action.data);

              this.configDialogService.openConfig(
                'Copy Job config',
                JSON.stringify(jobConfig, null, 2)
              );
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
        switchMap((action: any) =>
          from(this.apiService.setBotById(action.botId)).pipe(
            tap((botData: any) => {
              const botConfig = {
                ...mapBotParams(botData),
                jobParams: mapJobParams(action.data[0])
              };

              this.configDialogService.openConfig(
                'Copy Bot config',
                JSON.stringify(botConfig, null, 2)
              );
            }),
            catchError(() => EMPTY)
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
        switchMap(([action, bots]) =>
          from(this.apiService.setServerById(action.serverId)).pipe(
            tap(() => {
              const serverConfig = bots.map((bot: any) => ({
                id: bot.botId,
                botParams: mapBotParams(bot),
                jobParams: mapJobParams(bot.job)
              }));

              this.configDialogService.openConfig(
                'Copy Bot config',
                JSON.stringify(serverConfig, null, 2)
              );
            }),
            catchError(() => EMPTY)
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

  resetServerSettings$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(MainActions.resetServerSettings),
        concatLatestFrom(() => [
          this.store.select(DbConfigSelectors.getServersDataResponse),
          this.store.select(getBotsByServerIdResponse)
        ]),
        switchMap(([action, servers, bots]) => {
          const server = servers.find(s => +s.serverId === +action.serverId);
          if (!server || !bots) return EMPTY;

          const payload = {
            botsRulesList: bots.map(mapBotToRule)
          };

          return this.apiService
            .resetServerSettings(server.ip, server.port, {...payload})
            .pipe(tap(() => console.log('Config sent', payload)));
        })
      ),
    { dispatch: false }
  );

}
