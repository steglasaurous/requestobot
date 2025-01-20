import { contextBridge, ipcRenderer } from 'electron';
import { SongDto } from '@requestobot/util-dto';

/*
 * SHARED CONSTANTS BETWEEN MAIN and PRELOADER.
 * Using this in source since the preloader runs in the context of the renderer and can't import
 * other files at runtime.  A bundler could solve this but it's a lot of work for not a lot of benefit IMO.
 * Manage this manually between the two files for now.
 */
const IPC_OPEN_TWITCH_LOGIN = 'login.openTwitchLogin';
const IPC_SETTINGS_GET_VALUE = 'settings.getValue';
const IPC_SETTINGS_SET_VALUE = 'settings.setValue';
const IPC_SETTINGS_DELETE_VALUE = 'settings.deleteValue';

const IPC_SONG_DOWNLOADER_PROCESS_SONG = 'songDownloader.processSong';
const IPC_SONG_DOWNLOADER_PROCESS_SONG_PROGRESS =
  'songDownloader.processSongProgress';

const IPC_PROTOCOL_HANDLER = 'login.protocolHandler';
const IPC_OPEN_DIRECTORY_DIALOG = 'settings.openDirectoryDialog';

/*
 * END OF SHARED CONSTANTS
 */
contextBridge.exposeInMainWorld('electron', {
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),
  platform: process.platform,
});

contextBridge.exposeInMainWorld('settings', {
  setValue: (key: string, value: string) =>
    ipcRenderer.invoke(IPC_SETTINGS_SET_VALUE, key, value),
  getValue: (key: string) => ipcRenderer.invoke(IPC_SETTINGS_GET_VALUE, key),
  openTwitchLogin: () => ipcRenderer.invoke(IPC_OPEN_TWITCH_LOGIN),
  deleteValue: (key: string) =>
    ipcRenderer.invoke(IPC_SETTINGS_DELETE_VALUE, key),
  openDirectoryDialog: (defaultPath?: string) =>
    ipcRenderer.invoke(IPC_OPEN_DIRECTORY_DIALOG, defaultPath),
});

// For some reason, this errors out with "
contextBridge.exposeInMainWorld('login', {
  openTwitchLogin: () => ipcRenderer.invoke(IPC_OPEN_TWITCH_LOGIN),
  onProtocolHandle: (callback: any) =>
    ipcRenderer.on(IPC_PROTOCOL_HANDLER, (_event, url) => {
      callback(url);
    }),
});

contextBridge.exposeInMainWorld('songs', {
  processSong: (songDto: SongDto) =>
    ipcRenderer.invoke(IPC_SONG_DOWNLOADER_PROCESS_SONG, songDto),
  onProcessSongProgress: (callback: any) =>
    ipcRenderer.on(
      IPC_SONG_DOWNLOADER_PROCESS_SONG_PROGRESS,
      (_event, songState) => {
        callback(songState);
      }
    ),
});
