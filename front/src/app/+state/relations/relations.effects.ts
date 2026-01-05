import { Injectable, inject } from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import { catchError, EMPTY, map, of, switchMap, tap } from 'rxjs';
import * as RelationsActions from './relations.actions';
import {ApiService} from '../../services/api-service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Store } from '@ngrx/store';

@Injectable()
export class RelationsEffects {
  private actions$ = inject(Actions);
  private apiService = inject(ApiService);
  private _snackBar = inject(MatSnackBar);
  private store = inject(Store);

//====================================================================================================================
//                                                   Quote Relations
//====================================================================================================================

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

  setQuoteRelations$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RelationsActions.setQuoteRelations),
      switchMap(action =>
        this.apiService.getQuoteRelations().pipe(
          map(response =>
            RelationsActions.setQuoteRelationsSuccess({ response }),
          ),
          catchError(error => {
            this._snackBar.open(
              `${JSON.stringify(error.error?.message) ?? 'Error'}`,
              '',
              { duration: 5000 },
            );
            return of(
              RelationsActions.setQuoteRelationsFailure({
                error: error.error?.message ?? 'Unknown error',
              }),
            );
          }),
        ),
      ),
    ),
  );

  createQuoteRelations$ = createEffect(() =>
      this.actions$.pipe(
        ofType(RelationsActions.createQuoteRelations),
        switchMap(action =>
          this.apiService.createQuoteRelations(action.data).pipe(
            tap(response => {
              this.store.dispatch(RelationsActions.setQuoteRelationsDataList({ quoteId: action.quoteId }));
              this._snackBar.open(`Relations is created`, '', { duration: 5000 });
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

  deletingQuoteRelations$ = createEffect(() =>
      this.actions$.pipe(
        ofType(RelationsActions.deletingQuoteRelations),
        switchMap((action) => {
          return this.apiService.deleteQuoteRelations(action.quoteRelationsIds).pipe(
            tap(response => {
              this.store.dispatch(RelationsActions.setQuoteRelationsDataList({ quoteId: action.quoteId }));
              this._snackBar.open(`QuoteRelations is delete`, '', { duration: 5000 });
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
//                                                   Job Relations
//====================================================================================================================

  setJobRelationsDataList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RelationsActions.setJobRelationsDataList),
      switchMap(action =>
        this.apiService.getJobRelationsByQuoteId(action.jobId).pipe(
          map((response: any[]) => {
            const formattedData = response.map(item => ({
              quoteJobRelationId: item.quoteJobRelationId,
              job: item.job,
              quote: item.quoteRelation
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
        )
      )
    )
  );

  createJobRelations$ = createEffect(() =>
      this.actions$.pipe(
        ofType(RelationsActions.createJobRelations),
        switchMap(action =>
          this.apiService.createJobRelations(action.data).pipe(
            tap(response => {
              this._snackBar.open(`Relations is created`, '', { duration: 5000 });
              this.store.dispatch(RelationsActions.setJobRelationsDataList({ jobId: action.jobId }));
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

  deletingJobRelations$ = createEffect(() =>
      this.actions$.pipe(
        ofType(RelationsActions.deletingJobRelations),
        switchMap((action) => {
          return this.apiService.deleteJobRelations(action.jobRelationsIds).pipe(
            tap(response => {
              this.store.dispatch(RelationsActions.setJobRelationsDataList({ jobId: action.jobId }));
              this._snackBar.open(`JobRelations is delete`, '', { duration: 5000 });
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
