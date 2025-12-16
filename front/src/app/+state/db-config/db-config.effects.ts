import { Injectable, inject } from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import { catchError, EMPTY, map, of, switchMap, tap } from 'rxjs';
import * as DbConfigActions from './db-config.actions';
import {ApiService} from '../../services/api-service';
import { Store } from '@ngrx/store';
import { setTokensData } from './db-config.actions';


@Injectable()
export class DbConfigEffects {
  private actions$ = inject(Actions);
  private apiService = inject(ApiService);
  private store = inject(Store);

  //====================================================================================================================
  //                                                   Tokens
  //====================================================================================================================

  setTokensData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DbConfigActions.setTokensData),
      switchMap(() =>
        this.apiService.getTokensData().pipe(
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
        switchMap((action) => {
          return this.apiService.createToken({
            chainId: action.data.chainId,
            address: action.data.address,
            symbol: action.data.symbol,
            tokenName: action.data.tokenName,
            decimals: action.data.decimals,
          }).pipe(
            tap(response => {
              this.store.dispatch(setTokensData());
              console.log('API success:', response);
            }),
            catchError(error => {
              console.error('API error:', error);
              return EMPTY;
            })
          );
        })
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
              console.log('API success:', response);
            }),
            catchError(error => {
              console.error('API error:', error);
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
              console.log('API success:', response);
            }),
            catchError(error => {
              console.error('API error:', error);
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
        this.apiService.getPoolsData().pipe(
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

  //====================================================================================================================
  //                                                   Markets
  //====================================================================================================================

  setMarketsData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DbConfigActions.setMarketsData),
      switchMap(() =>
        this.apiService.getMarketsData().pipe(
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

  //====================================================================================================================
  //                                                   Dexes
  //====================================================================================================================

  setDexesData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DbConfigActions.setDexesData),
      switchMap(() =>
        this.apiService.getDexesData().pipe(
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

}
