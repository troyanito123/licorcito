import { createReducer, on } from '@ngrx/store';
import { User } from 'src/app/models/user.model';
import { setUser, unsetUser } from '../actions/auth.action';

export interface AuthState {
  user: User;
}

export const initialAuthState: AuthState = {
  user: null,
};

const _authReducer = createReducer(
  initialAuthState,

  on(setUser, (state, { user }) => ({ ...state, user })),
  on(unsetUser, (state) => ({ ...state, user: null }))
);

export function authReducer(state, action) {
  return _authReducer(state, action);
}
