import { createFeatureSelector } from '@ngrx/store';
import { AuthState } from './auth.reducer';

export const selectAuth = createFeatureSelector<AuthState>('auth');
