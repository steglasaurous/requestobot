import { Injectable } from '@angular/core';
import { WindowWithElectron } from '../models/window.global';
import log from 'electron-log/renderer';

declare let window: WindowWithElectron;

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  async getValue(key: string): Promise<string | undefined> {
    // This is to avoid typescript complaining that settings is not part of the window type.
    // There's some workarounds: https://stackoverflow.com/questions/12709074/how-do-you-explicitly-set-a-new-property-on-window-in-typescript
    if (window['settings']) {
      return await window['settings'].getValue(key);
    } else {
      log.debug('Getting setting from memory', { key: key });
      return Promise.resolve(
        window.localStorage.getItem(`setting:${key}`) ?? undefined
      );
    }
  }

  async setValue(key: string, value: string): Promise<void> {
    if (window['settings']) {
      return await window['settings'].setValue(key, value);
    } else {
      log.debug('Set setting in memory', { key: key, value: value });
      window.localStorage.setItem(`setting:${key}`, value);
      return Promise.resolve();
    }
  }

  async deleteValue(key: string): Promise<void> {
    if (window['settings']) {
      return await window['settings'].deleteValue(key);
    } else {
      log.debug('Deleting setting in memory', { key: key });
      window.localStorage.removeItem(`setting:${key}`);
    }
  }
}
