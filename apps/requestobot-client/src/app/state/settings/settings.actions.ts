import { createActionGroup, props } from '@ngrx/store';

export interface SettingValues {
  key: string;
  value: string;
}
export const SettingsActions = createActionGroup({
  source: 'Settings',
  events: {
    'Get Values': props<{ keys: string[] }>(),
    'Get Values Success': props<{ values: SettingValues[] }>(),
    'Set Value': props<{ key: string; value: string }>(),
    'Delete Values': props<{ key: string[] }>(),
  },
});
