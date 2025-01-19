import * as fs from 'fs';
import { SettingName } from '@requestobot/util-client-common';

export class SettingsStoreService {
  constructor(private filePath: string) {}

  setValue(key: SettingName, value: string) {
    const settings = this.loadSettings();

    settings[key] = value;

    this.saveSettings(settings);
  }

  getValue(key: SettingName): string | undefined {
    const settings = this.loadSettings();
    if (settings[key]) {
      return settings[key];
    }
    return undefined;
  }

  deleteValue(key: SettingName): void {
    const settings = this.loadSettings();
    if (settings[key]) {
      delete settings[key];
    }

    this.saveSettings(settings);
  }

  private loadSettings(): any {
    let settings;

    if (!fs.existsSync(this.filePath)) {
      // assume we need to create it.
      settings = {};
    } else {
      settings = JSON.parse(fs.readFileSync(this.filePath).toString());
    }
    return settings;
  }

  private saveSettings(settings: any): void {
    fs.writeFileSync(this.filePath, JSON.stringify(settings));
  }
}
