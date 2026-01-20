import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as MainActions from './main.actions';
import {catchError, EMPTY, filter, forkJoin, from, map, mergeMap, of, switchMap, tap, withLatestFrom} from 'rxjs';
import { IArbitrumMultiQuoteJob } from '../../models/main';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfigDialogService } from '../../services/config-dialog-service';
import { ApiService } from '../../services/api-service';
import {ContractsService} from '../../services/contracts-service';
import {getPoolsDataResponse} from '../db-config/db-config.selectors';
import {Store} from '@ngrx/store';
import {editPool} from '../db-config/db-config.actions';

@Injectable()
export class MainEffects {
  private actions$ = inject(Actions);
  private _snackBar = inject(MatSnackBar);
  private configDialogService = inject(ConfigDialogService);
  private apiService = inject(ApiService);
  private contractsService = inject(ContractsService);
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
        switchMap((data: any) =>
          from(this.apiService.setServerById(data.serverId)).pipe(
            tap((serverData: any) => {
              const botConfig = data.data.map((botData: any) => {
                const jobQuoteJobRelations = botData.job.quoteJobRelations.map((quoteRelation: any) => {
                    return {
                      dex: quoteRelation.quoteRelation.pair.pool.dex.name,
                      version: quoteRelation.quoteRelation.pair.pool.version as "v2" | "v3" | "v4",
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
                    }
                  }
                );

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
                    rpcUrl: 'https://arb1.arbitrum.io/rpc',
                    pairsToQuote: jobQuoteJobRelations
                  }
                }
              })

              const serverConfig = {
                botList: botConfig
              }
              const configString = JSON.stringify(serverConfig, null, 2);
              const configTitle = 'Copy Bot config';
              this.configDialogService.openConfig(configTitle, configString);
            }),
            catchError((err) => {
              console.error('Error fetching server data:', err);
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

  tokenImportCamelotV3$ = createEffect(() =>
      this.actions$.pipe(
        ofType(MainActions.tokenImportCamelotV3),
        switchMap((action: any) => {
          const pools = JSON.parse(action.data).data.pools;

          const requests = pools.flatMap((item: any) => [
            this.apiService.createToken({
              address: item.token0.id,
              chainId: "42161",
              tokenId: null,
              symbol: item.token0.symbol,
              tokenName: item.token0.name,
              decimals: Number(item.token0.decimals) || 18
            }).pipe(
              tap(response => {
                this._snackBar.open(`Token created: ${response.tokenName}`, '', {duration: 3000});
              }),
              catchError(error => {
                console.error('Could not create token1: ', error);
                this._snackBar.open(`Error: ${error.error?.message}`, '', {duration: 5000});
                return EMPTY;
              })
            ),
            this.apiService.createToken({
              address: item.token1.id,
              chainId: "42161",
              tokenId: null,
              symbol: item.token1.symbol,
              tokenName: item.token1.symbol,
              decimals: Number(item.token1.decimals) || 18
            }).pipe(
              tap(response => {
                this._snackBar.open(`Token created: ${response.tokenName}`, '', {duration: 3000});
              }),
              catchError(error => {
                console.error('Could not create token2: ', error);
                this._snackBar.open(`Error: ${error.error?.message}`, '', {duration: 5000});
                return EMPTY;
              })
            )
          ]);

          return requests.length > 0 ? forkJoin(requests) : EMPTY;
        })
      ),
    { dispatch: false }
  );

  poolImportCamelotV3$ = createEffect(() =>
      this.actions$.pipe(
        ofType(MainActions.poolImportCamelotV3),
        tap(() => console.log('Начало импорта пулов Camelot V3')),
        switchMap((action: any) => {
          console.log('Получены данные:', action.data);

          const parsed = JSON.parse(action.data);
          console.log('Парсинг JSON:', parsed);

          const pools = parsed.data.pools;
          console.log('Найдено пулов:', pools?.length);

          if (!pools || pools.length === 0) {
            console.warn('Нет пулов для импорта ');
            this._snackBar.open('Нет пулов для импорта', '', { duration: 3000 });
            return EMPTY;
          }

          // Создаем запросы
          const requests = pools.map((item: any, index: number) => {
            console.log(`Обработка пула ${index + 1}/${pools.length}:`, item.id);
            console.log('Token0 address:', item.token0.address);
            console.log('Token1 address:', item.token1.address);

            return forkJoin({
              token0Id: this.apiService.getOneTokenByAddress(item.token0.id).pipe(
                tap(token => console.log(`Получен token0 для ${item.id}:`, token))
              ),
              token1Id: this.apiService.getOneTokenByAddress(item.token1.id).pipe(
                tap(token => console.log(`Получен token1 для ${item.id}:`, token))
              )
            }).pipe(
              tap(ids => console.log(`Получены оба ID для пула ${item.id}:`, ids)),
              switchMap(({ token0Id, token1Id }) => {
                console.log(`Создание пула ${item.id} с token0:`, token0Id, 'token1:', token1Id);

                // Проверяем структуру ответа
                const token = token0Id.tokenId;
                const token2 = token1Id.tokenId;

                return this.apiService.createPool({
                  chainId: "42161",
                  token: token,
                  token2: token2,
                  dexId: 20,
                  fee: 0,
                  version: 'v2',
                  poolAddress: item.id,
                });
              }),
              tap(response => {
                console.log(`Пул создан успешно:`, response);
                this._snackBar.open(`Пул создан: ${item.id}`, '', { duration: 3000 });
              }),
              catchError(error => {
                console.error(`Ошибка создания пула ${item.id}:`, error);
                this._snackBar.open(`Ошибка пула ${item.id}: ${error.error?.message || error.message}`, '', { duration: 5000 });
                return EMPTY;
              })
            );
          });

          console.log('Запуск forkJoin для', requests.length, 'запросов');

          return forkJoin(requests).pipe(
            tap(results => {
              console.log('Все пулы успешно обработаны:', results);
              this._snackBar.open(`Успешно импортировано ${results} пулов`, '', { duration: 3000 });
            }),
            catchError(error => {
              console.error('Общая ошибка импорта:', error);
              this._snackBar.open(`Ошибка импорта: ${error.message}`, '', { duration: 5000 });
              return EMPTY;
            })
          );
        }),
        catchError(error => {
          console.error('Ошибка в эффекте poolImportCamelotV3$:', error);
          return EMPTY;
        })
      ),
    { dispatch: false }
  );


  setFee$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MainActions.setFee),
      withLatestFrom(this.store.select(getPoolsDataResponse)),
      mergeMap(([_, poolData]) =>
        from(poolData).pipe(
          filter(item => item.fee === 0),
          mergeMap(item => {
            // V2 — fee фиксированный
            if (item.version === 'v2') {
              console.log('Delay')
              return of(
                editPool({
                  data: {
                    poolId: item.poolId,
                    chainId: item.chain.chainId,
                    poolAddress: item.poolAddress,
                    token: item.token.tokenId!,
                    token2: item.token2.tokenId!,
                    fee: 3000,
                    dexId: item.dex.dexId,
                    version: item.version,
                  },
                })
              );
            }

            // V3 — получаем fee с сервера
            if (item.version === 'v3') {
              console.log('go2')
              return this.contractsService
                .getPoolFee(item.poolAddress)
                .pipe(
                  map(fee =>
                    editPool({
                      data: {
                        poolId: item.poolId,
                        chainId: item.chain.chainId,
                        poolAddress: item.poolAddress,
                        token: item.token.tokenId!,
                        token2: item.token2.tokenId!,
                        fee: Number(fee),
                        dexId: item.dex.dexId,
                        version: item.version,
                      },
                    })
                  )
                );
            }

            return EMPTY;
          })
        )
      )
    )
  );


}
