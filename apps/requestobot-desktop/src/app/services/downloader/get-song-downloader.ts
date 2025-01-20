import { DownloadHandler } from './handlers/download-handler.interface';
import { SpinRhythmDownloadHandler } from './handlers/spin-rhythm-download-handler';
import { SongDownloader } from './song-downloader';
import { AudioTripDownloadHandler } from './handlers/audio-trip-download-handler';
import { SynthRidersDownloadHandler } from './handlers/synth-riders-download-handler';
import { SettingName } from '@requestobot/util-client-common';

import App from '../../app';

export function getDownloaderService() {
  const defaultDirs: Map<string, string> = new Map<string, string>();

  if (process.platform == 'win32') {
    const appData = process.env['APPDATA'];
    defaultDirs.set(
      SettingName.synthSongsDir,
      // FIXME: There's gotta be a better way to suss this out.  Steam API of some sort?
      'C:\\Program Files (x86)\\Steam\\steamapps\\common\\SynthRiders\\SynthRidersUC\\CustomSongs'
    );

    defaultDirs.set(
      SettingName.audioTripSongsDir,
      appData.replace('Roaming', 'LocalLow') +
        '\\Kinemotik Studios\\Audio Trip\\Songs'
    );

    defaultDirs.set(
      SettingName.spinRhythmSongsDir,
      appData.replace('Roaming', 'LocalLow') +
        '\\Super Spin Digital\\Spin Rhythm XD\\Custom'
    );
  } else if (process.platform == 'linux') {
    defaultDirs.set(
      SettingName.synthSongsDir,
      process.env['HOME'] +
        '/.steam/steam/steamapps/common/SynthRiders/SynthRidersUC/CustomSongs'
    );
    // FIXME: Figure out locations for linux
  }

  const downloadHandlers: DownloadHandler[] = [];

  // Set defaults for downloaders unless there's a setting available.
  let synthSongsDir = App.settingsStoreService.getValue(
    SettingName.synthSongsDir
  );
  if (!synthSongsDir) {
    // Set a sensible default
    console.log('setting default');
    synthSongsDir = defaultDirs.get(SettingName.synthSongsDir);
    App.settingsStoreService.setValue(SettingName.synthSongsDir, synthSongsDir);
  }

  let spinRhythmSongsDir = App.settingsStoreService.getValue(
    SettingName.spinRhythmSongsDir
  );
  if (!spinRhythmSongsDir) {
    spinRhythmSongsDir = defaultDirs.get(SettingName.spinRhythmSongsDir);
    App.settingsStoreService.setValue(
      SettingName.spinRhythmSongsDir,
      spinRhythmSongsDir
    );
  }

  let audioTripSongsDir = App.settingsStoreService.getValue(
    SettingName.audioTripSongsDir
  );
  if (!audioTripSongsDir) {
    audioTripSongsDir = defaultDirs.get(SettingName.audioTripSongsDir);
    App.settingsStoreService.setValue(
      SettingName.audioTripSongsDir,
      audioTripSongsDir
    );
  }

  downloadHandlers.push(
    new SpinRhythmDownloadHandler(spinRhythmSongsDir),
    new AudioTripDownloadHandler(audioTripSongsDir),
    new SynthRidersDownloadHandler(synthSongsDir)
  );

  return new SongDownloader(downloadHandlers, App.settingsStoreService);
}
