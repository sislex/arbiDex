import { Injectable, inject } from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import * as RelationsActions from './relations.actions';
import {ApiService} from '../../services/api-service';
import { MatSnackBar } from '@angular/material/snack-bar';


@Injectable()
export class RelationsEffects {
  private actions$ = inject(Actions);
  private apiService = inject(ApiService);
  private _snackBar = inject(MatSnackBar);

//====================================================================================================================
//                                                   Pair Quote Relations
//====================================================================================================================

  // setPairRelationsDataList$ = createEffect(() =>
  //   this.actions$.pipe(
  //     ofType(DbConfigActions.setPairRelationsDataList),
  //     switchMap(() =>
  //       this.apiService.getPairQuoteRelationsByPairId(id).pipe(
  //         // tap(response => {
  //         //   console.log('Servers response:', response);
  //         // }),
  //         map(response =>
  //           DbConfigActions.setServersDataSuccess({ response })
  //         ),
  //         catchError(error =>
  //           of(DbConfigActions.setServersDataFailure({ error }))
  //         )
  //       )
  //     )
  //   )
  // );

  // createServer$ = createEffect(() =>
  //     this.actions$.pipe(
  //       ofType(DbConfigActions.createServer),
  //       switchMap(action =>
  //         this.apiService.createServer({ ...action.data }).pipe(
  //           tap(response => {
  //             this.store.dispatch(setServersData());
  //             this._snackBar.open(`Server is created: ${response.serverId}`, '', { duration: 5000 });
  //           }),
  //           catchError(error => {
  //             this._snackBar.open(`${JSON.stringify(error.error.message)}`, '', { duration: 5000 });
  //             return EMPTY;
  //           })
  //         )
  //       )
  //     ),
  //   { dispatch: false }
  // );
  //
  // deletingServer$ = createEffect(() =>
  //     this.actions$.pipe(
  //       ofType(DbConfigActions.deletingServer),
  //       switchMap((action) => {
  //
  //         return this.apiService.deletingServer(action.serverId).pipe(
  //           tap(response => {
  //             this.store.dispatch(setServersData());
  //             this._snackBar.open(`Server is delete`, '', { duration: 5000 });
  //           }),
  //           catchError(error => {
  //             this._snackBar.open(`${JSON.stringify(error.error.message)}`, '', { duration: 5000 });
  //             return EMPTY;
  //           })
  //         );
  //       })
  //     ),
  //   { dispatch: false }
  // );

  setQuoteRelationsDataList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RelationsActions.setQuoteRelationsDataList),
      switchMap(action =>
        this.apiService.getQuoteRelationsByQuoteId(action.quoteId).pipe(
          map(response =>
            RelationsActions.setQuoteRelationsDataListSuccess({ response }),
          ),
          catchError(error => {
            this._snackBar.open(
              `${JSON.stringify(error.error?.message) ?? 'Error'}`,
              '',
              { duration: 5000 },
            );
            return of(
              RelationsActions.setQuoteRelationsDataListFailure({
                error: error.error?.message ?? 'Unknown error',
              }),
            );
          }),
        ),
      ),
    ),
  );
}
