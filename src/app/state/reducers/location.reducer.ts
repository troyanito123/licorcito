import { createReducer, on } from '@ngrx/store';
import { setLocation, unsetLocation } from '../actions/location.action';

export interface LocationState {
  lng: number;
  lat: number;
}

export const initialLocationState: LocationState = {
  lng: null,
  lat: null,
};

const _locationReducer = createReducer(
  initialLocationState,

  on(setLocation, (state, { lat, lng }) => ({ lat, lng })),
  on(unsetLocation, (state) => ({ lat: null, lng: null }))
);

export function locationReducer(state, action) {
  return _locationReducer(state, action);
}
