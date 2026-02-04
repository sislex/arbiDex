import { createAction, props } from '@ngrx/store';

export const getJobConfig = createAction('[Main] getJobConfig');
export const getJobConfigSuccess = createAction(
  '[Main] getJobConfigSuccess'
);
export const setJobPreConfig = createAction(
  '[Main] setJobPreConfig',
  props<{ data: any[], jobId: number }>()
);
export const setBotPreConfig = createAction(
  '[Main] setBotPreConfig',
  props<{ data: any[], botId: number }>()
);
export const setServerPreConfig = createAction(
  '[Main] setServerPreConfig',
  props<{ data: any[], serverId: number }>()
);
export const resetServerSettings = createAction(
  '[Main] resetServerSettings',
  props<{ data: any[], serverId: number }>()
);
export const copyConfig = createAction(
  '[Main] copyConfig',
  props<{ config: string }>()
);
export const tokenImportCamelotV3 = createAction(
  '[Main] tokenImportCamelotV3',
  props<{ data: string }>()
);
export const poolImportCamelotV3 = createAction(
  '[Main] poolImportCamelotV3',
  props<{ data: string }>()
);

export const setFee = createAction('[Main] setFee');
