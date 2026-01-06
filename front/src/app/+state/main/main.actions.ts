import { createAction, props } from '@ngrx/store';

export const getJobConfig = createAction('[Main] getJobConfig');
export const getJobConfigSuccess = createAction(
  '[Main] getJobConfigSuccess'
);
export const setPreConfig = createAction(
  '[Main] setPreConfig',
  props<{ data: any[] }>()
);
export const copyConfig = createAction(
  '[Main] copyConfig',
  props<{ config: string }>()
);
