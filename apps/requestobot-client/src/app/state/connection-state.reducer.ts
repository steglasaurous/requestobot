import { ConnectionState } from '../models/connection-state';
import { AuthState } from '../models/auth-state.enum';
import { ConnectionStateActions } from './connection-state.actions';
import { createReducer, on } from '@ngrx/store';

export const initialState: ConnectionState = {
  authState: AuthState.Unknown,
};

export const connectionStateReducer = createReducer(
  initialState,
  on(ConnectionStateActions.authenticated, (state) => ({
    ...state,
    authState: AuthState.Authenticated,
  })),
  on(ConnectionStateActions.notAuthenticated, (state) => ({
    ...state,
    authState: AuthState.NotAuthenticated,
  }))
);
