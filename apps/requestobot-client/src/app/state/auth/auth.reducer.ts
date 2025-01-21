import { createReducer, on } from '@ngrx/store';
import { AuthActions } from './auth.actions';

export interface AuthState {
  username: string;
  loginProcessState: LoginProcessState;
}
export enum LoginProcessState {
  Idle,
  Success,
  Fail,
}

export const initialState: AuthState = {
  username: '',
  loginProcessState: LoginProcessState.Idle,
};

export const authReducer = createReducer(
  initialState,
  on(AuthActions.loginSuccess, (state, { username }) => ({
    username,
    loginProcessState: LoginProcessState.Success,
  })),
  on(AuthActions.loginFail, () => ({
    username: '',
    loginProcessState: LoginProcessState.Fail,
  })),
  on(AuthActions.logout, () => initialState)
);
