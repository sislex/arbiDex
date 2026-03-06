import { createAction, props } from '@ngrx/store';

export const toggleSidebar = createAction('[View] toggleSidebar');
export const setActiveSidebarItem = createAction(
  '[View] setActiveSidebarItem',
  props<{ item: string }>()
);
export const setDisplayInWei = createAction(
  '[View] setDisplayInWei',
  props<{ item: boolean }>()
);
