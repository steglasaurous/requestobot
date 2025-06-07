import { createReducer, on } from '@ngrx/store';
import { WebsocketActions } from './websocket.actions';

export interface WebsocketState {
  enabled: boolean;
  isConnected: boolean;
  lastConnectionErrorMessage: string;
  uri: string;
  channelName: string;
  chatServiceName: string;
}

export const initialState: WebsocketState = {
  enabled: false,
  isConnected: false,
  lastConnectionErrorMessage: '',
  uri: '',
  channelName: '',
  chatServiceName: '',
};

export const websocketReducer = createReducer(
  initialState,
  on(
    WebsocketActions.connect,
    (state, { uri, chatServiceName, channelName }) => {
      return {
        ...state,
        uri: uri,
        chatServiceName: chatServiceName,
        channelName: channelName,
      };
    }
  ),
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
