import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as MainActions from './main.actions';
import {catchError, EMPTY, from, lastValueFrom, map, of, switchMap, tap, withLatestFrom} from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfigDialogService } from '../../services/config-dialog-service';
import { ApiService } from '../../services/api-service';
import { concatLatestFrom } from '@ngrx/operators';
import {Store} from '@ngrx/store';
import {getBotsByServerIdResponse, getRpcUrlDataResponse} from '../db-config/db-config.selectors';
import * as DbConfigSelectors from '../db-config/db-config.selectors';
import * as RelationsActions from '../relations/relations.actions';

export function mapQuoteRelation(item: any) {
  const qr = item.quoteRelation ?? item;

  const pair = qr.pair;
  const pool = pair?.pool;

  return {
    dex: pool?.dex?.name.toLowerCase() || '-',
    version: (pool?.version as 'v2' | 'v3' | 'v4') || '-',
    poolAddress: String(pool?.poolAddress || '-'),
    token0: pool?.token0?.address || '-',
    token1: pool?.token1?.address || '-',
    feePpm: pool?.fee || 0,
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
    jobParams: botData.job ? mapJobParams( botData.job ) : mapCexJobParams(botData.cexJob),
  };
}


export function mapJobParams(job: any) {

  if (!job) {
    return {
      jobType: '-',
      rpcUrl: null,
      pairsToQuote: [],
      extraSettings: {},
      cexPairId: null
    };
  }

  const type = job.jobType || job.job_type || '-';
  const rpcUrl = job.rpcUrl?.rpcUrl || null;

  const pairsToQuote = job.quoteJobRelations
    ? job.quoteJobRelations.map(mapQuoteRelation)
    : [];

  return {
    extraSettings: job.extraSettings || {},
    cexPairId: job.cex_pair_id || null,

    jobType: type,
    rpcUrl: rpcUrl,
    source: "dex:" + job.chain.name.toLowerCase() || '',
    token0: job.quoteJobRelations[0].quoteRelation.pair.pool.token0.address || '',
    token1: job.quoteJobRelations[0].quoteRelation.pair.pool.token1.address || '',

    pairsToQuote: pairsToQuote,
  };
}

export function mapCexJobParams(job: any) {
  return {
    jobType: job.job_type,
    source: job.pair.chain.name,
    token0: job.pair.token0,
    token1: job.pair.token1,
  };
}

export function mapJobPreConfig(jobData: any, relations: any[]) {
  return {
    jobType: jobData.jobType,
    rpcUrl: jobData.rpcUrl.rpcUrl,
    pairsToQuote: relations.map(mapQuoteRelation),
    extraSettings: jobData.extraSettings,
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
        withLatestFrom(this.store.select(getRpcUrlDataResponse)),
        switchMap(([action, rpcList]) =>
          from(this.apiService.setBotById(action.botId)).pipe(
            tap(async (botData: any) => {

              const quoteJobRelations = await lastValueFrom(this.apiService.getJobRelationsByJobId(botData.job.jobId).pipe(
                map((response: any[]) => {
                  const formattedData = response.map(item => ({
                    quoteJobRelationId: item.quoteJobRelationId,
                    job: item.job,
                    quoteRelation : item.quoteRelation
                  }));

                  return RelationsActions.setJobRelationsDataListSuccess({
                    response: formattedData
                  });
                }),
                catchError(error => {
                  this._snackBar.open(
                    error.error?.message ?? 'Error loading links',
                    '',
                    { duration: 5000 }
                  );
                  return of(
                    RelationsActions.setJobRelationsDataListFailure({
                      error: error.error?.message ?? 'Unknown error',
                    })
                  );
                })
              ));

              const rpcUrlId = action.data[0].rpcUrlId;
              const foundRpc = rpcList.find(rpc => rpc.rpcUrlId === rpcUrlId);

              const actionConfig = {
                ...action.data[0],
                rpcUrl: {rpcUrl: foundRpc?.rpcUrl},
                quoteJobRelations: (quoteJobRelations as any).response || [],
              };

              const botConfig = {
                botParams: {...mapBotParams(botData)},
                jobParams: mapJobParams(actionConfig)
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

  setServerPreConfig$ = createEffect(() =>
      this.actions$.pipe(
        ofType(MainActions.setServerPreConfig),
        concatLatestFrom(() => this.store.select(getBotsByServerIdResponse)),
        switchMap(([action, bots]) =>
          from(this.apiService.setServerById(action.serverId)).pipe(
            tap(() => {
              const serverConfig = bots.map((bot: any) => ({
                id: bot.botId,
                botParams: mapBotParams(bot),
                jobParams: bot.job ? mapJobParams( bot.job ) : mapCexJobParams(bot.cexJob),
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
