import { createAction, props } from '@ngrx/store';

export const setLocation = createAction(
  '[LOCATION] set location',
  props<{ lng: number; lat: number }>()
);
export const unsetLocation = createAction('[LOCATION] unset location');
