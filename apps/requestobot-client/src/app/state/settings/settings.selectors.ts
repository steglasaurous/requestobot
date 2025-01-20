import { createFeatureSelector } from '@ngrx/store';
import { SettingsState } from './settings.reducer';

export const selectSettings = createFeatureSelector<SettingsState>('settings');
