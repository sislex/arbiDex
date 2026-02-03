import { Injectable, inject } from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {catchError, EMPTY, map, mergeMap, of, switchMap, tap} from 'rxjs';
import * as DbConfigActions from './db-config.actions';
import {ApiService} from '../../services/api-service';
import { Store } from '@ngrx/store';
import { MatSnackBar } from '@angular/material/snack-bar';
import {initPoolsPage} from './db-config.actions';


@Injectable()
export class DbConfigEffects {
  private actions$ = inject(Actions);
  private apiService = inject(ApiService);
  private store = inject(Store);
  private _snackBar = inject(MatSnackBar);


  //====================================================================================================================
  //                                                   Tokens
  //====================================================================================================================

  setTokensData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DbConfigActions.setTokensData),
      switchMap(() =>
        this.apiService.getTokens().pipe(
          map(response =>
            DbConfigActions.setTokensDataSuccess({ response })
          ),
          catchError(error =>
            of(DbConfigActions.setTokensDataFailure({ error }))
          )
        )
      )
    )
  );

  createToken$ = createEffect(() =>
      this.actions$.pipe(
        ofType(DbConfigActions.createToken),
        switchMap(action =>
          this.apiService.createToken({ ...action.data }).pipe(
            tap(response => {
              this.store.dispatch(DbConfigActions.setTokensData());
              this._snackBar.open(`Token is created: ${response.tokenName}`, '', { duration: 5000 });
            }),
            catchError(error => {
              this._snackBar.open(`${JSON.stringify(error.error.message)}`, '', { duration: 5000 });
              return EMPTY;
            })
          )
        )
      ),
    { dispatch: false }
  );

  editToken$ = createEffect(() =>
      this.actions$.pipe(
        ofType(DbConfigActions.editToken),
        switchMap((action) => {
          let data = {...action.data};
          return this.apiService.editToken(data.tokenId, data).pipe(
            tap(response => {
              this.store.dispatch(DbConfigActions.setTokensData());
              this._snackBar.open(`Token is update: ${response.tokenName}`, '', { duration: 5000 });
            }),
            catchError(error => {
              this._snackBar.open(`${JSON.stringify(error.error.message)}`, '', { duration: 5000 });
              return EMPTY;
            })
          );
        })
      ),
    { dispatch: false }
  );

  deletingToken$ = createEffect(() =>
      this.actions$.pipe(
        ofType(DbConfigActions.deletingToken),
        switchMap((action) => {

          return this.apiService.deletingToken(action.tokenId).pipe(
            tap(response => {
              this.store.dispatch(DbConfigActions.setTokensData());
              this._snackBar.open(`Token is delete`, '', { duration: 5000 });
            }),
            catchError(error => {
              this._snackBar.open(`${JSON.stringify(error.error.message)}`, '', { duration: 5000 });
              return EMPTY;
            })
          );
        })
      ),
    { dispatch: false }
  );

  //====================================================================================================================
  //                                                   Pools
  //====================================================================================================================

  initPoolsPage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(initPoolsPage),
      mergeMap(() => [
        DbConfigActions.setPoolsData(),
        DbConfigActions.setTokensData(),
        DbConfigActions.setDexesData(),
        DbConfigActions.setChainsData(),
      ])
    )
  );

  setPoolsData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DbConfigActions.setPoolsData),
      switchMap(() =>
        this.apiService.getPools().pipe(
          map(response =>
            DbConfigActions.setPoolsDataSuccess({ response })
          ),
          catchError(error =>
            of(DbConfigActions.setPoolsDataFailure({ error }))
          )
        )
      )
    )
  );

  createPool$ = createEffect(() =>
      this.actions$.pipe(
        ofType(DbConfigActions.createPool),
        switchMap(action =>
          this.apiService.createPool({ ...action.data }).pipe(
            tap(response => {
              this.store.dispatch(DbConfigActions.setPoolsData());
              this._snackBar.open(`Pool is created: ${response}`, '', { duration: 5000 });
            }),
            catchError(error => {
              this._snackBar.open(`${JSON.stringify(error.error.message)}`, '', { duration: 5000 });
              return EMPTY;
            })
          )
        )
      ),
    { dispatch: false }
  );

  editPool$ = createEffect(() =>
      this.actions$.pipe(
        ofType(DbConfigActions.editPool),
        switchMap((action) => {
          let data = {...action.data};
          return this.apiService.editPool(data.poolId, data).pipe(
            tap(response => {
              this.store.dispatch(DbConfigActions.setPoolsData());
              this._snackBar.open(`Pool is update: ${response.poolId}`, '', { duration: 5000 });
            }),
            catchError(error => {
              this._snackBar.open(`${JSON.stringify(error.error.message)}`, '', { duration: 5000 });
              return EMPTY;
            })
          );
        })
      ),
    { dispatch: false }
  );

  deletingPool$ = createEffect(() =>
      this.actions$.pipe(
        ofType(DbConfigActions.deletingPools),
        switchMap((action) => {

          return this.apiService.deletingPool(action.poolId).pipe(
            tap(response => {
              this.store.dispatch(DbConfigActions.setPoolsData());
              this._snackBar.open(`Pool is delete`, '', { duration: 5000 });
            }),
            catchError(error => {
              this._snackBar.open(`${JSON.stringify(error.error.message)}`, '', { duration: 5000 });
              return EMPTY;
            })
          );
        })
      ),
    { dispatch: false }
  );

  //====================================================================================================================
  //                                                   Dexes
  //====================================================================================================================

  setDexesData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DbConfigActions.setDexesData),
      switchMap(() =>
        this.apiService.getDexes().pipe(
          map(response =>
            DbConfigActions.setDexesDataSuccess({ response })
          ),
          catchError(error =>
            of(DbConfigActions.setDexesDataFailure({ error }))
          )
        )
      )
    )
  );

  createDex$ = createEffect(() =>
      this.actions$.pipe(
        ofType(DbConfigActions.createDex),
        switchMap(action =>
          this.apiService.createDex({ ...action.data }).pipe(
            tap(response => {
              this.store.dispatch(DbConfigActions.setDexesData());
              this._snackBar.open(`Dex is created: ${response.name}`, '', { duration: 5000 });
            }),
            catchError(error => {
              this._snackBar.open(`${JSON.stringify(error.error.message)}`, '', { duration: 5000 });
              return EMPTY;
            })
          )
        )
      ),
    { dispatch: false }
  );

  editDex$ = createEffect(() =>
      this.actions$.pipe(
        ofType(DbConfigActions.editDex),
        switchMap((action) => {
          let data = {...action.data};
          return this.apiService.editDex(data.dexId, data).pipe(
            tap(response => {
              this.store.dispatch(DbConfigActions.setDexesData());
              this._snackBar.open(`Dex is update: ${response.dexId}`, '', { duration: 5000 });
            }),
            catchError(error => {
              this._snackBar.open(`${JSON.stringify(error.error.message)}`, '', { duration: 5000 });
              return EMPTY;
            })
          );
        })
      ),
    { dispatch: false }
  );

  deletingDex$ = createEffect(() =>
      this.actions$.pipe(
        ofType(DbConfigActions.deletingDex),
        switchMap((action) => {

          return this.apiService.deletingDex(action.dexId).pipe(
            tap(response => {
              this.store.dispatch(DbConfigActions.setDexesData());
              this._snackBar.open(`Dex is delete`, '', { duration: 5000 });
            }),
            catchError(error => {
              this._snackBar.open(`${JSON.stringify(error.error.message)}`, '', { duration: 5000 });
              return EMPTY;
            })
          );
        })
      ),
    { dispatch: false }
  );

  //====================================================================================================================
  //                                                   Chains
  //====================================================================================================================

  setChainsData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DbConfigActions.setChainsData),
      switchMap(() =>
        this.apiService.getChainsData().pipe(
          map(response =>
            DbConfigActions.setChainsDataSuccess({ response })
          ),
          catchError(error =>
            of(DbConfigActions.setChainsDataFailure({ error }))
          )
        )
      )
    )
  );

  createChain$ = createEffect(() =>
      this.actions$.pipe(
        ofType(DbConfigActions.createChain),
        switchMap(action =>
          this.apiService.createChain({ ...action.data }).pipe(
            tap(response => {
              this.store.dispatch(DbConfigActions.setChainsData());
              this._snackBar.open(`Chain is created: ${response.name}`, '', { duration: 5000 });
            }),
            catchError(error => {
              this._snackBar.open(`${JSON.stringify(error.error.message)}`, '', { duration: 5000 });
              return EMPTY;
            })
          )
        )
      ),
    { dispatch: false }
  );

  editChain$ = createEffect(() =>
      this.actions$.pipe(
        ofType(DbConfigActions.editChain),
        switchMap((action) => {
          let data = {...action.data};
          return this.apiService.editChain(data.chainId, data).pipe(
            tap(response => {
              this.store.dispatch(DbConfigActions.setChainsData());
              this._snackBar.open(`Chain is update: ${response.chainId}`, '', { duration: 5000 });
            }),
            catchError(error => {
              this._snackBar.open(`${JSON.stringify(error.error.message)}`, '', { duration: 5000 });
              return EMPTY;
            })
          );
        })
      ),
    { dispatch: false }
  );

  deletingChain$ = createEffect(() =>
      this.actions$.pipe(
        ofType(DbConfigActions.deletingChain),
        switchMap((action) => {

          return this.apiService.deletingChain(action.chainId).pipe(
            tap(response => {
              this.store.dispatch(DbConfigActions.setChainsData());
              this._snackBar.open(`Chain is delete`, '', { duration: 5000 });
            }),
            catchError(error => {
              this._snackBar.open(`${JSON.stringify(error.error.message)}`, '', { duration: 5000 });
              return EMPTY;
            })
          );
        })
      ),
    { dispatch: false }
  );

//====================================================================================================================
//                                                   Pairs
//====================================================================================================================

  setPairsData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DbConfigActions.setPairsData),
      switchMap(() =>
        this.apiService.getPairs().pipe(
          // tap(response => {
          //   console.log('Pairs response:', response);
          // }),
          map(response =>
            DbConfigActions.setPairsDataSuccess({ response })
          ),
          catchError(error =>
            of(DbConfigActions.setPairsDataFailure({ error }))
          )
        )
      )
    )
  );

  createPair$ = createEffect(() =>
      this.actions$.pipe(
        ofType(DbConfigActions.createPair),
        switchMap(action =>
          this.apiService.createPair({ ...action.data }).pipe(
            tap(response => {
              this.store.dispatch(DbConfigActions.setPairsData());
              this._snackBar.open(`Pair is created: ${response.pairId}`, '', { duration: 5000 });
            }),
            catchError(error => {
              this._snackBar.open(`${JSON.stringify(error.error.message)}`, '', { duration: 5000 });
              return EMPTY;
            })
          )
        )
      ),
    { dispatch: false }
  );

  editPair$ = createEffect(() =>
      this.actions$.pipe(
        ofType(DbConfigActions.editPair),
        switchMap((action) => {
          let data = {...action.data};
          return this.apiService.editPair(data.pairId, data).pipe(
            tap(response => {
              this.store.dispatch(DbConfigActions.setPairsData());
              this._snackBar.open(`Pair is update: ${response.pairId}`, '', { duration: 5000 });
            }),
            catchError(error => {
              this._snackBar.open(`${JSON.stringify(error.error.message)}`, '', { duration: 5000 });
              return EMPTY;
            })
          );
        })
      ),
    { dispatch: false }
  );

  deletingPair$ = createEffect(() =>
      this.actions$.pipe(
        ofType(DbConfigActions.deletingPair),
        switchMap((action) => {

          return this.apiService.deletingPair(action.pairId).pipe(
            tap(response => {
              this.store.dispatch(DbConfigActions.setPairsData());
              this._snackBar.open(`Pair is delete`, '', { duration: 5000 });
            }),
            catchError(error => {
              this._snackBar.open(`${JSON.stringify(error.error.message)}`, '', { duration: 5000 });
              return EMPTY;
            })
          );
        })
      ),
    { dispatch: false }
  );

  //====================================================================================================================
  //                                                   Quotes
  //====================================================================================================================

  setQuotesData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DbConfigActions.setQuotesData),
      switchMap(() =>
        this.apiService.getQuotes().pipe(
          // tap(response => {
          //   console.log('Quotes response:', response);
          // }),
          map(response =>
            DbConfigActions.setQuotesDataSuccess({ response })
          ),
          catchError(error =>
            of(DbConfigActions.setQuotesDataFailure({ error }))
          )
        )
      )
    )
  );

  setOneQuoteData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DbConfigActions.setOneQuoteData),
      switchMap((action) =>
        this.apiService.getOneQuote(action.id).pipe(
          map(response =>
            DbConfigActions.setQuotesDataSuccess({ response })
          ),
          catchError(error =>
            of(DbConfigActions.setQuotesDataFailure({ error }))
          )
        )
      )
    )
  );

  createQuote$ = createEffect(() =>
      this.actions$.pipe(
        ofType(DbConfigActions.createQuote),
        switchMap(action =>
          this.apiService.createQuote({ ...action.data }).pipe(
            tap(response => {
              this.store.dispatch(DbConfigActions.setQuotesData());
              this._snackBar.open(`Quote is created: ${response.quoteId}`, '', { duration: 5000 });
            }),
            catchError(error => {
              this._snackBar.open(`${JSON.stringify(error.error.message)}`, '', { duration: 5000 });
              return EMPTY;
            })
          )
        )
      ),
    { dispatch: false }
  );

  editQuote$ = createEffect(() =>
      this.actions$.pipe(
        ofType(DbConfigActions.editQuote),
        switchMap((action) => {
          let data = {...action.data};
          return this.apiService.editQuote(data.quoteId, data).pipe(
            tap(response => {
              this.store.dispatch(DbConfigActions.setQuotesData());
              this._snackBar.open(`Quote is update: ${response.quoteId}`, '', { duration: 5000 });
            }),
            catchError(error => {
              this._snackBar.open(`${JSON.stringify(error.error.message)}`, '', { duration: 5000 });
              return EMPTY;
            })
          );
        })
      ),
    { dispatch: false }
  );

  deletingQuote$ = createEffect(() =>
      this.actions$.pipe(
        ofType(DbConfigActions.deletingQuote),
        switchMap((action) => {

          return this.apiService.deletingQuote(action.quoteId).pipe(
            tap(response => {
              this.store.dispatch(DbConfigActions.setQuotesData());
              this._snackBar.open(`Quote is delete`, '', { duration: 5000 });
            }),
            catchError(error => {
              this._snackBar.open(`${JSON.stringify(error.error.message)}`, '', { duration: 5000 });
              return EMPTY;
            })
          );
        })
      ),
    { dispatch: false }
  );

//====================================================================================================================
//                                                   Jobs
//====================================================================================================================

  setJobsData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DbConfigActions.setJobsData),
      switchMap(() =>
        this.apiService.getJobs().pipe(
          // tap(response => {
          //   console.log('Jobs response:', response);
          // }),
          map(response =>
            DbConfigActions.setJobsDataSuccess({ response })
          ),
          catchError(error =>
            of(DbConfigActions.setJobsDataFailure({ error }))
          )
        )
      )
    )
  );

  createJob$ = createEffect(() =>
      this.actions$.pipe(
        ofType(DbConfigActions.createJob),
        switchMap(action =>
          this.apiService.createJob({ ...action.data }).pipe(
            tap(response => {
              this.store.dispatch(DbConfigActions.setJobsData());
              this._snackBar.open(`Job is created: ${response.jobId}`, '', { duration: 5000 });
            }),
            catchError(error => {
              this._snackBar.open(`${JSON.stringify(error.error.message)}`, '', { duration: 5000 });
              return EMPTY;
            })
          )
        )
      ),
    { dispatch: false }
  );

  editJob$ = createEffect(() =>
      this.actions$.pipe(
        ofType(DbConfigActions.editJob),
        switchMap((action) => {
          let data = {...action.data};
          return this.apiService.editJob(data.jobId, data).pipe(
            tap(response => {
              this.store.dispatch(DbConfigActions.setJobsData());
              this._snackBar.open(`Job is update: ${response.jobId}`, '', { duration: 5000 });
            }),
            catchError(error => {
              this._snackBar.open(`${JSON.stringify(error.error.message)}`, '', { duration: 5000 });
              return EMPTY;
            })
          );
        })
      ),
    { dispatch: false }
  );

  deletingJob$ = createEffect(() =>
      this.actions$.pipe(
        ofType(DbConfigActions.deletingJob),
        switchMap((action) => {

          return this.apiService.deletingJob(action.jobId).pipe(
            tap(response => {
              this.store.dispatch(DbConfigActions.setJobsData());
              this._snackBar.open(`Job is delete`, '', { duration: 5000 });
            }),
            catchError(error => {
              this._snackBar.open(`${JSON.stringify(error.error.message)}`, '', { duration: 5000 });
              return EMPTY;
            })
          );
        })
      ),
    { dispatch: false }
  );


//====================================================================================================================
//                                                   Bots
//====================================================================================================================

  setBotsData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DbConfigActions.setBotsData),
      switchMap(() =>
        this.apiService.getBots().pipe(
          // tap(response => {
          //   console.log('Bots response:', response);
          // }),
          map(response =>
            DbConfigActions.setBotsDataSuccess({ response })
          ),
          catchError(error =>
            of(DbConfigActions.setBotsDataFailure({ error }))
          )
        )
      )
    )
  );

  setBotsByServerId$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DbConfigActions.setBotsByServerId),
      switchMap((action) =>
        this.apiService.getBotsByServerId(action.serverId).pipe(
          // tap(response => {
          //   console.log('Bots action:', action);
          //   console.log('Bots response:', response);
          // }),
          map(response =>
            DbConfigActions.setBotsByServerIdSuccess({ response })
          ),
          catchError(error =>
            of(DbConfigActions.setBotsByServerIdFailure({ error }))
          )
        )
      )
    )
  );

  createBot$ = createEffect(() =>
      this.actions$.pipe(
        ofType(DbConfigActions.createBot),
        switchMap(action =>
          this.apiService.createBot({ ...action.data }).pipe(
            tap(response => {
              this.store.dispatch(DbConfigActions.setBotsData());
              this._snackBar.open(`Bot is created: ${response.botName}`, '', { duration: 5000 });
            }),
            catchError(error => {
              this._snackBar.open(`${JSON.stringify(error.error.message)}`, '', { duration: 5000 });
              return EMPTY;
            })
          )
        )
      ),
    { dispatch: false }
  );

  editBot$ = createEffect(() =>
      this.actions$.pipe(
        ofType(DbConfigActions.editBot),
        switchMap((action) => {
          let data = {...action.data};
          return this.apiService.editBot(data.botId, data).pipe(
            tap(response => {
              this.store.dispatch(DbConfigActions.setBotsData());
              this._snackBar.open(`Bot is update: ${response.botId}`, '', { duration: 5000 });
            }),
            catchError(error => {
              this._snackBar.open(`${JSON.stringify(error.error.message)}`, '', { duration: 5000 });
              return EMPTY;
            })
          );
        })
      ),
    { dispatch: false }
  );

  deletingBot$ = createEffect(() =>
      this.actions$.pipe(
        ofType(DbConfigActions.deletingBot),
        switchMap((action) => {

          return this.apiService.deletingBot(action.botId).pipe(
            tap(response => {
              this.store.dispatch(DbConfigActions.setBotsData());
              this._snackBar.open(`Bot is delete`, '', { duration: 5000 });
            }),
            catchError(error => {
              this._snackBar.open(`${JSON.stringify(error.error.message)}`, '', { duration: 5000 });
              return EMPTY;
            })
          );
        })
      ),
    { dispatch: false }
  );

//====================================================================================================================
//                                                   Servers
//====================================================================================================================

  setServersData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DbConfigActions.setServersData),
      switchMap(() =>
        this.apiService.getServers().pipe(
          // tap(response => {
          //   console.log('Servers response:', response);
          // }),
          map(response =>
            DbConfigActions.setServersDataSuccess({ response })
          ),
          catchError(error =>
            of(DbConfigActions.setServersDataFailure({ error }))
          )
        )
      )
    )
  );

  createServer$ = createEffect(() =>
      this.actions$.pipe(
        ofType(DbConfigActions.createServer),
        switchMap(action =>
          this.apiService.createServer({ ...action.data }).pipe(
            tap(response => {
              this.store.dispatch(DbConfigActions.setServersData());
              this._snackBar.open(`Server is created: ${response.serverId}`, '', { duration: 5000 });
            }),
            catchError(error => {
              this._snackBar.open(`${JSON.stringify(error.error.message)}`, '', { duration: 5000 });
              return EMPTY;
            })
          )
        )
      ),
    { dispatch: false }
  );

  editServer$ = createEffect(() =>
      this.actions$.pipe(
        ofType(DbConfigActions.editServer),
        switchMap((action) => {
          let data = {...action.data};
          return this.apiService.editServer(data.serverId, data).pipe(
            tap(response => {
              this.store.dispatch(DbConfigActions.setServersData());
              this._snackBar.open(`Server is update: ${response.serverId}`, '', { duration: 5000 });
            }),
            catchError(error => {
              this._snackBar.open(`${JSON.stringify(error.error.message)}`, '', { duration: 5000 });
              return EMPTY;
            })
          );
        })
      ),
    { dispatch: false }
  );

  deletingServer$ = createEffect(() =>
      this.actions$.pipe(
        ofType(DbConfigActions.deletingServer),
        switchMap((action) => {

          return this.apiService.deletingServer(action.serverId).pipe(
            tap(response => {
              this.store.dispatch(DbConfigActions.setServersData());
              this._snackBar.open(`Server is delete`, '', { duration: 5000 });
            }),
            catchError(error => {
              this._snackBar.open(`${JSON.stringify(error.error.message)}`, '', { duration: 5000 });
              return EMPTY;
            })
          );
        })
      ),
    { dispatch: false }
  );

//====================================================================================================================
//                                                   Rpc Urls
//====================================================================================================================

  setRpcUrlsData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DbConfigActions.setRpcUrlsData),
      switchMap(() =>
        this.apiService.getRpcUrls().pipe(
          map(response =>
            DbConfigActions.setRpcUrlsDataSuccess({ response })
          ),
          catchError(error =>
            of(DbConfigActions.setRpcUrlsDataFailure({ error }))
          )
        )
      )
    )
  );

  createRpcUrl$ = createEffect(() =>
      this.actions$.pipe(
        ofType(DbConfigActions.createRpcUrl),
        switchMap(action =>
          this.apiService.createRpcUrl({ ...action.data }).pipe(
            tap(response => {
              this.store.dispatch(DbConfigActions.setRpcUrlsData());
              this._snackBar.open(`Rpc Url is created: ${response.rpcUrlId}`, '', { duration: 5000 });
            }),
            catchError(error => {
              this._snackBar.open(`${JSON.stringify(error.error.message)}`, '', { duration: 5000 });
              return EMPTY;
            })
          )
        )
      ),
    { dispatch: false }
  );

  editRpcUrl$ = createEffect(() =>
      this.actions$.pipe(
        ofType(DbConfigActions.editRpcUrl),
        switchMap((action) => {
          let data = {...action.data};
          return this.apiService.editRpcUrl(data.rpcUrlId, data).pipe(
            tap(response => {
              this.store.dispatch(DbConfigActions.setRpcUrlsData());
              this._snackBar.open(`Rpc Url is update: ${response.rpcUrlId}`, '', { duration: 5000 });
            }),
            catchError(error => {
              this._snackBar.open(`${JSON.stringify(error.error.message)}`, '', { duration: 5000 });
              return EMPTY;
            })
          );
        })
      ),
    { dispatch: false }
  );

  deletingRpcUrl$ = createEffect(() =>
      this.actions$.pipe(
        ofType(DbConfigActions.deletingRpcUrl),
        switchMap((action) => {

          return this.apiService.deletingRpcUrl(action.rpcUrlId).pipe(
            tap(response => {
              this.store.dispatch(DbConfigActions.setRpcUrlsData());
              this._snackBar.open(`RpcUrl is delete`, '', { duration: 5000 });
            }),
            catchError(error => {
              this._snackBar.open(`${JSON.stringify(error.error.message)}`, '', { duration: 5000 });
              return EMPTY;
            })
          );
        })
      ),
    { dispatch: false }
  );

}
