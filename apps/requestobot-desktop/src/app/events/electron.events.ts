/**
 * This module is responsible on handling all the inter process communications
 * between the frontend to the electron backend.
 */

import { app, ipcMain, shell } from 'electron';
import { environment } from '../../environments/environment';
import { SongDto } from '@requestobot/util-dto';
import App from '../app';

const IPC_OPEN_TWITCH_LOGIN = 'login.openTwitchLogin';
const IPC_SETTINGS_GET_VALUE = 'settings.getValue';
const IPC_SETTINGS_SET_VALUE = 'settings.setValue';
const IPC_SETTINGS_DELETE_VALUE = 'settings.deleteValue';

const IPC_SONG_DOWNLOADER_PROCESS_SONG = 'songDownloader.processSong';
const IPC_SONG_DOWNLOADER_PROCESS_SONG_PROGRESS =
  'songDownloader.processSongProgress';

const LOGIN_URL = `${environment.queuebotApiBaseUrl}/auth/twitch`;

export default class ElectronEvents {
  static bootstrapElectronEvents(): Electron.IpcMain {
    return ipcMain;
  }
}

// Retrieve app version
ipcMain.handle('get-app-version', (event) => {
  console.log(`Fetching application version... [v${environment.version}]`);

  return environment.version;
});

// Handle App termination
ipcMain.on('quit', (event, code) => {
  app.exit(code);
});

ipcMain.handle(IPC_SETTINGS_SET_VALUE, (event, key, value) => {
  App.settingsStoreService.setValue(key, value);
});

ipcMain.handle(IPC_SETTINGS_GET_VALUE, (event, key) => {
  return App.settingsStoreService.getValue(key);
});

ipcMain.handle(IPC_SETTINGS_DELETE_VALUE, (event, key) => {
  return App.settingsStoreService.deleteValue(key);
});

ipcMain.handle(IPC_OPEN_TWITCH_LOGIN, (event, args) => {
  console.log('Opening external');
  shell.openExternal(LOGIN_URL).then(() => {
    console.log('opened it');
  });
});

ipcMain.handle(
  IPC_SONG_DOWNLOADER_PROCESS_SONG,
  async (event, song: SongDto) => {
    await App.songDownloader.processSong(song, (songState: any) => {
      App.mainWindow?.webContents.send(
        IPC_SONG_DOWNLOADER_PROCESS_SONG_PROGRESS,
        songState
      );
    });
  }
);
