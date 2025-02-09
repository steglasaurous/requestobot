import { createReducer, on } from '@ngrx/store';
import { WebsocketActions } from './websocket.actions';

export interface WebsocketState {
  enabled: boolean;
  isConnected: boolean;
  lastConnectionErrorMessage: string;
}

export const initialState: WebsocketState = {
  enabled: false,
  isConnected: false,
  lastConnectionErrorMessage: '',
};

export const websocketReducer = createReducer(
  initialState,
  on(WebsocketActions.enable, (state) => {
    return { ...state, enabled: true };
  }),
  on(WebsocketActions.disable, (state) => {
    return { ...state, enabled: false };
  }),
  on(WebsocketActions.connected, (state) => {
    return { ...state, isConnected: true };
  }),
  on(WebsocketActions.connectionError, (state, { message }) => {
    return {
      ...state,
      isConnected: false,
      lastConnectionErrorMessage: message,
    };
  })
);
