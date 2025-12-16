import { Injectable, inject } from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import { catchError, EMPTY, map, of, switchMap, tap, withLatestFrom } from 'rxjs';
import * as DbConfigActions from './db-config.actions';
import {ApiService} from '../../services/api-service';
import { Store } from '@ngrx/store';
import { getChainsDataResponse } from './db-config.selectors';


@Injectable()
export class DbConfigEffects {
  private actions$ = inject(Actions);
  private apiService = inject(ApiService);
  private store = inject(Store);

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

  createToken = createEffect(() =>
      this.actions$.pipe(
        ofType(DbConfigActions.createToken),
        withLatestFrom(this.store.select(getChainsDataResponse)),
        switchMap(([action, chains]) => {
          const chain = chains.find(c => c.name === action.data.selected);

          if (!chain) {
            console.error('Chain not found');
            return EMPTY;
          }

          return this.apiService.createToken({
            chainId: chain.chainId,
            address: action.data.address,
          }).pipe(
            tap(response => console.log('API success:', response)),
            catchError(error => {
              console.error('API error:', error);
              return EMPTY;
            })
          );
        })
      ),
    { dispatch: false }
  );




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
