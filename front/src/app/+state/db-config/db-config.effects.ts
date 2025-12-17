import { Injectable, inject } from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import { catchError, EMPTY, map, of, switchMap, tap } from 'rxjs';
import * as DbConfigActions from './db-config.actions';
import {ApiService} from '../../services/api-service';
import { Store } from '@ngrx/store';
import { setChainsData, setDexesData, setMarketsData, setPoolsData, setTokensData } from './db-config.actions';
import { MatSnackBar } from '@angular/material/snack-bar';


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
              this.store.dispatch(setTokensData());
              this._snackBar.open(`Token is created: ${action.data.tokenName}`, '', { duration: 5000 });
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
              this.store.dispatch(setTokensData());
              this._snackBar.open(`Token is update: ${action.data.tokenName}`, '', { duration: 5000 });
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
              this.store.dispatch(setTokensData());
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
              this.store.dispatch(setPoolsData());
              this._snackBar.open(`Token is created: ${response}`, '', { duration: 5000 });
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

  //====================================================================================================================
  //                                                   Markets
  //====================================================================================================================

  setMarketsData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DbConfigActions.setMarketsData),
      switchMap(() =>
        this.apiService.getMarkets().pipe(
          map(response =>
            DbConfigActions.setMarketsDataSuccess({ response })
          ),
          catchError(error =>
            of(DbConfigActions.setMarketsDataFailure({ error }))
          )
        )
      )
    )
  );



  createMarket$ = createEffect(() =>
      this.actions$.pipe(
        ofType(DbConfigActions.createMarket),
        switchMap(action =>
          this.apiService.createMarket({ ...action.data }).pipe(
            tap(response => {
              this.store.dispatch(setMarketsData());
              this._snackBar.open(`Token is created: ${action.data.marketId}`, '', { duration: 5000 });
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
              this.store.dispatch(setDexesData());
              this._snackBar.open(`Token is created: ${action.data.name}`, '', { duration: 5000 });
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
              this.store.dispatch(setChainsData());
              this._snackBar.open(`Token is created: ${action.data.name}`, '', { duration: 5000 });
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

}
