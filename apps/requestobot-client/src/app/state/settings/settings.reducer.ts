import { createReducer, on } from '@ngrx/store';
import { SettingsActions } from './settings.actions';

export interface SettingsState {
  [key: string]: string;
}

export const initialState: SettingsState = {};

export const settingsReducer = createReducer(
  initialState,
  on(SettingsActions.getValuesSuccess, (state, { values }) => {
    const newState = { ...state };
    for (const keyValue of values) {
      newState[keyValue.key] = keyValue.value;
    }

    return newState;
  }),
  on(SettingsActions.setValue, (state, { key, value }) => {
    return { ...state, [key]: value };
  })
);
