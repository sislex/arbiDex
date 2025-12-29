import { Injectable, inject } from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import { catchError, EMPTY, switchMap, tap } from 'rxjs';
import * as RelationsActions from './relations.actions';
import {ApiService} from '../../services/api-service';
import { Store } from '@ngrx/store';
import { MatSnackBar } from '@angular/material/snack-bar';


@Injectable()
export class RelationsEffects {
  private actions$ = inject(Actions);
  private apiService = inject(ApiService);
  private store = inject(Store);
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
        switchMap((action) => {

          return this.apiService.getQuoteRelationsByQuoteId(action.pairId).pipe(
            tap(response => {
              this.store.dispatch(RelationsActions.setQuoteRelationsDataListSuccess(response));
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
