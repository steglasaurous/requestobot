import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButton } from '@angular/material/button';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { Store } from '@ngrx/store';
import { selectSettings } from '../../state/settings/settings.selectors';
import { SettingsActions } from '../../state/settings/settings.actions';
import { SettingName } from '@requestobot/util-client-common';
import { SettingsState } from '../../state/settings/settings.reducer';
import { WindowWithElectron } from '../../models/window.global';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { SongRequestsActions } from '../../state/song-requests/song-requests.actions';

declare let window: WindowWithElectron;

@Component({
  selector: 'app-settings',
  imports: [
    CommonModule,
    MatButton,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogTitle,
    MatTabsModule,
    MatSlideToggle,
  ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css',
})
export class SettingsComponent {
  settings$ = this.store.select(selectSettings);
  settings: SettingsState = {};

  constructor(
    public dialogRef: MatDialogRef<SettingsComponent>,
    private store: Store
  ) {
    this.settings$.subscribe((settings) => {
      this.settings = settings;
    });

    this.store.dispatch(
      SettingsActions.getValues({
        keys: [
          SettingName.synthSongsDir,
          SettingName.audioTripSongsDir,
          SettingName.spinRhythmSongsDir,
          SettingName.autoDownloadEnabled,
        ],
      })
    );
  }

  async chooseDirectory(settingName: string, defaultPath?: string) {
    if (window['settings']) {
      const result = await window['settings'].openDirectoryDialog(defaultPath);
      if (result) {
        this.store.dispatch(
          SettingsActions.setValue({ key: settingName, value: result })
        );
        this.store.dispatch(SongRequestsActions.reprocessSongs());
      }
    }
  }

  protected readonly SettingName = SettingName;

  toggleAutoDownloadEnabled() {
    this.store.dispatch(
      SettingsActions.setValue({
        key: SettingName.autoDownloadEnabled,
        value: 'true',
      })
    );
  }
}
