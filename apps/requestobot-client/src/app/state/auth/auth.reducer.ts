import { createReducer, on } from '@ngrx/store';
import { AuthActions } from './auth.actions';
import { AuthorizedState } from '../../models/authorized-state.enum';

export interface AuthState {
  username: string;
  loginProcessState: LoginProcessState;
  authState: AuthorizedState;
}
export enum LoginProcessState {
  Idle,
  Success,
  Fail,
}

export const initialState: AuthState = {
  username: '',
  loginProcessState: LoginProcessState.Idle,
  authState: AuthorizedState.Unknown,
};

export const authReducer = createReducer(
  initialState,
  on(AuthActions.loginSuccess, (state, { username }) => ({
    username,
    loginProcessState: LoginProcessState.Success,
    authState: AuthorizedState.Authenticated,
  })),
  on(AuthActions.loginFail, () => ({
    username: '',
    loginProcessState: LoginProcessState.Fail,
    authState: AuthorizedState.NotAuthenticated,
  })),
  on(AuthActions.logout, () => initialState),
  on(AuthActions.authenticated, (state) => ({
    ...state,
    authState: AuthorizedState.Authenticated,
  })),
  on(AuthActions.notAuthenticated, (state) => ({
    ...state,
    authState: AuthorizedState.NotAuthenticated,
  })),
  on(AuthActions.connectionFailure, (state) => ({
    ...state,
    authState: AuthorizedState.ConnectionFailure,
  }))
);
