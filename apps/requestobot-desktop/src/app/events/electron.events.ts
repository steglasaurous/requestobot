/**
 * This module is responsible on handling all the inter process communications
 * between the frontend to the electron backend.
 */

import { app, dialog, ipcMain, shell } from 'electron';
import { environment } from '../../environments/environment';
import { SongDto } from '@requestobot/util-dto';
import App from '../app';
import log from 'electron-log/main';

const IPC_OPEN_TWITCH_LOGIN = 'login.openTwitchLogin';
const IPC_SETTINGS_GET_VALUE = 'settings.getValue';
const IPC_SETTINGS_SET_VALUE = 'settings.setValue';
const IPC_SETTINGS_DELETE_VALUE = 'settings.deleteValue';

const IPC_SONG_DOWNLOADER_PROCESS_SONG = 'songDownloader.processSong';
const IPC_SONG_DOWNLOADER_PROCESS_SONG_PROGRESS =
  'songDownloader.processSongProgress';

const IPC_OPEN_DIRECTORY_DIALOG = 'settings.openDirectoryDialog';

const LOGIN_URL = `${environment.queuebotApiBaseUrl}/auth/twitch`;

export default class ElectronEvents {
  static bootstrapElectronEvents(): Electron.IpcMain {
    return ipcMain;
  }
}

// Retrieve app version
ipcMain.handle('get-app-version', (event) => {
  log.debug(`Fetching application version... [v${environment.version}]`);

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
  let loginUrl = LOGIN_URL;
  if (App.isDevelopmentMode()) {
    loginUrl += '?mode=authcode';
  }
  shell.openExternal(loginUrl).then(() => {
    log.debug('Opened external browser at login url');
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

ipcMain.handle(IPC_OPEN_DIRECTORY_DIALOG, (event, defaultPath?: string) => {
  const selectedPath = dialog.showOpenDialogSync({
    defaultPath: defaultPath,
    properties: ['openDirectory'],
  });
  if (selectedPath) {
    return selectedPath.pop();
  }
});
