import { createFeatureSelector } from '@ngrx/store';
import { WebsocketState } from './websocket.reducer';

export const selectWebsocket =
  createFeatureSelector<WebsocketState>('websocket');
