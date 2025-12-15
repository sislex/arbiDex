import { Injectable, inject } from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {catchError, map, of, switchMap} from 'rxjs';
import * as DbConfigActions from './db-config.actions';
import {ApiService} from '../../services/api-service';


@Injectable()
export class DbConfigEffects {
  private actions$ = inject(Actions);
  private apiService = inject(ApiService);

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
