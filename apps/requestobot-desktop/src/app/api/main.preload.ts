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

// API IPC channels
const IPC_API_GAMES_GET = 'api:games:get';
const IPC_API_CHANNELS_GET = 'api:channels:get';
const IPC_API_CHANNELS_GET_BY_ID = 'api:channels:getById';
const IPC_API_CHANNELS_CREATE = 'api:channels:create';
const IPC_API_CHANNELS_JOIN = 'api:channels:join';
const IPC_API_SONG_REQUESTS_GET = 'api:song-requests:get';
const IPC_API_SONG_REQUESTS_SWAP = 'api:song-requests:swap';
const IPC_API_SONG_REQUESTS_DELETE = 'api:song-requests:delete';
const IPC_API_PLAYER_GET = 'api:player:get';
const IPC_API_PLAYER_PLAY = 'api:player:play';
const IPC_API_PLAYER_PAUSE = 'api:player:pause';
const IPC_API_PLAYER_STOP = 'api:player:stop';
const IPC_API_PLAYER_SET_VOLUME = 'api:player:setVolume';
const IPC_API_SETTINGS_GET = 'api:settings:get';
const IPC_API_SETTINGS_SET = 'api:settings:set';

// Real-time event channels
const IPC_EVENT_SONG_REQUEST_QUEUE_CHANGED = 'event:songRequestQueueChanged';
const IPC_EVENT_PLAYER_STATE_CHANGE = 'event:playerStateChange';

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

// API bridge for NestJS backend
contextBridge.exposeInMainWorld('api', {
  // Games
  getGames: () => ipcRenderer.invoke(IPC_API_GAMES_GET),
  
  // Channels
  getChannel: (chatServiceName: string, channelName: string) =>
    ipcRenderer.invoke(IPC_API_CHANNELS_GET, chatServiceName, channelName),
  getChannelById: (channelId: number) =>
    ipcRenderer.invoke(IPC_API_CHANNELS_GET_BY_ID, channelId),
  createChannel: (chatServiceName: string, channelName: string) =>
    ipcRenderer.invoke(IPC_API_CHANNELS_CREATE, chatServiceName, channelName),
  joinChannel: (chatServiceName: string, channelName: string) =>
    ipcRenderer.invoke(IPC_API_CHANNELS_JOIN, chatServiceName, channelName),
  
  // Song Requests
  getSongRequests: (channelId: number, getNextSong?: boolean) =>
    ipcRenderer.invoke(IPC_API_SONG_REQUESTS_GET, channelId, getNextSong),
  swapSongRequestOrder: (channelId: number, sourceId: number, destinationId: number) =>
    ipcRenderer.invoke(IPC_API_SONG_REQUESTS_SWAP, channelId, sourceId, destinationId),
  deleteSongRequest: (channelId: number, songRequestId: number) =>
    ipcRenderer.invoke(IPC_API_SONG_REQUESTS_DELETE, channelId, songRequestId),
  
  // Player
  getPlayerState: (channelId: number) =>
    ipcRenderer.invoke(IPC_API_PLAYER_GET, channelId),
  playSong: (channelId: number, songId: number) =>
    ipcRenderer.invoke(IPC_API_PLAYER_PLAY, channelId, songId),
  pausePlayer: (channelId: number) =>
    ipcRenderer.invoke(IPC_API_PLAYER_PAUSE, channelId),
  stopPlayer: (channelId: number) =>
    ipcRenderer.invoke(IPC_API_PLAYER_STOP, channelId),
  setPlayerVolume: (channelId: number, volume: number) =>
    ipcRenderer.invoke(IPC_API_PLAYER_SET_VOLUME, channelId, volume),
  
  // Settings
  getSetting: (channelId: number, settingName: string) =>
    ipcRenderer.invoke(IPC_API_SETTINGS_GET, channelId, settingName),
  setSetting: (channelId: number, settingName: string, value: string) =>
    ipcRenderer.invoke(IPC_API_SETTINGS_SET, channelId, settingName, value),
  
  // Real-time events
  onSongRequestQueueChanged: (callback: any) =>
    ipcRenderer.on(IPC_EVENT_SONG_REQUEST_QUEUE_CHANGED, (_event, data) => {
      callback(data);
    }),
  onPlayerStateChange: (callback: any) =>
    ipcRenderer.on(IPC_EVENT_PLAYER_STATE_CHANGE, (_event, data) => {
      callback(data);
    }),
  
  // Remove event listeners
  removeAllListeners: (channel: string) => ipcRenderer.removeAllListeners(channel),
});
