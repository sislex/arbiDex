import { createAction, props } from '@ngrx/store';

export const getJobConfig = createAction('[Main] getJobConfig');
export const getJobConfigSuccess = createAction(
  '[Main] getJobConfigSuccess'
);
export const copyConfig = createAction(
  '[Main] copyConfig',
  props<{ config: string }>()
);
