import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { SettingsService } from '../../services/settings.service';
import { SettingsActions, SettingValues } from './settings.actions';
import { exhaustMap } from 'rxjs';
import { Store } from '@ngrx/store';

@Injectable()
export class SettingsEffects {
  getSettings$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(SettingsActions.getValues),
        exhaustMap(async ({ keys }) => {
          const settingValues: SettingValues[] = [];

          for (const key of keys) {
            const value = await this.settingsService.getValue(key);
            settingValues.push({ key: key, value: value ?? '' });
          }
          this.store.dispatch(
            SettingsActions.getValuesSuccess({ values: settingValues })
          );
        })
      ),
    { dispatch: false }
  );

  setValue$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(SettingsActions.setValue),
        exhaustMap(async ({ key, value }) => {
          await this.settingsService.setValue(key, value);
        })
      ),
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private settingsService: SettingsService,
    private store: Store
  ) {}
}
