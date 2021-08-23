import { createReducer, on } from '@ngrx/store';
import { initLoading, stopLoading } from '../actions/ui.actions';

export interface UiState {
  isLoading: boolean;
}

export const initialUiState: UiState = {
  isLoading: false,
};

const _uiReducer = createReducer(
  initialUiState,

  on(initLoading, (state) => ({ ...state, isLoading: true })),
  on(stopLoading, (state) => ({ ...state, isLoading: false }))
);

export function uiReducer(state, action) {
  return _uiReducer(state, action);
}
