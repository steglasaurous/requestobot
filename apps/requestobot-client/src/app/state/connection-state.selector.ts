import { createFeatureSelector } from '@ngrx/store';
import { ConnectionState } from '../models/connection-state';

export const selectConnectionState =
  createFeatureSelector<ConnectionState>('connectionState');
