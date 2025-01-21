import { DownloadHandler } from './handlers/download-handler.interface';
import { SpinRhythmDownloadHandler } from './handlers/spin-rhythm-download-handler';
import { SongDownloader } from './song-downloader';
import { AudioTripDownloadHandler } from './handlers/audio-trip-download-handler';
import { SynthRidersDownloadHandler } from './handlers/synth-riders-download-handler';
import { SettingName } from '@requestobot/util-client-common';

import App from '../../app';

export function getDownloaderService() {
  const downloadHandlers: DownloadHandler[] = [];

  downloadHandlers.push(
    new SpinRhythmDownloadHandler(
      App.settingsStoreService.getValue(SettingName.spinRhythmSongsDir)
    ),
    new AudioTripDownloadHandler(
      App.settingsStoreService.getValue(SettingName.audioTripSongsDir)
    ),
    new SynthRidersDownloadHandler(
      App.settingsStoreService.getValue(SettingName.synthSongsDir)
    )
  );

  return new SongDownloader(downloadHandlers, App.settingsStoreService);
}
