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

    // FIXME: fill in dance dash, pistol whip
  } else if (process.platform == 'linux') {
    defaultDirs.set(
      SettingName.synthSongsDir,
      process.env['HOME'] +
        '/.steam/steam/steamapps/common/SynthRiders/SynthRidersUC/CustomSongs'
    );

    // FIXME: Need to figure out what this resolves to in linux
    // defaultDirs.set(
    //   SettingName.spinRhythmSongsDir,
    //   process.env['HOME'] +
    //   '/.steam/steam/steamapps/common/SynthRiders/SynthRidersUC/CustomSongs'
    // );
    // defaultDirs.set(
    //   SettingName.audioTripSongsDir,
    //   process.env['HOME'] +
    //     '/.steam/steam/steamapps/common/SynthRiders/SynthRidersUC/CustomSongs'
    // );
  }

  const downloadHandlers: DownloadHandler[] = [];

  // Set defaults for downloaders unless there's a setting available.
  let synthSongsDir = App.settingsStoreService.getValue(
    SettingName.synthSongsDir
  );
  if (!synthSongsDir) {
    // Set a sensible default
    synthSongsDir = '';
    App.settingsStoreService.setValue(SettingName.synthSongsDir, synthSongsDir);
  }

  downloadHandlers.push(
    new SpinRhythmDownloadHandler(
      App.settingsStoreService.getValue(SettingName.spinRhythmSongsDir) ??
        defaultDirs.get(SettingName.spinRhythmSongsDir)
    ),
    new AudioTripDownloadHandler(
      App.settingsStoreService.getValue(SettingName.audioTripSongsDir) ??
        defaultDirs.get(SettingName.audioTripSongsDir)
    ),

    new SynthRidersDownloadHandler(
      App.settingsStoreService.getValue(SettingName.synthSongsDir) ??
        defaultDirs.get(SettingName.synthSongsDir)
      //'C:\\Program Files (x86)\\Steam\\steamapps\\common\\SynthRiders\\SynthRidersUC\\CustomSongs'
      // 'E:\\SteamLibrary\\steamapps\\common\\SynthRiders\\SynthRIdersUC\\CustomSongs'
    )
  );

  return new SongDownloader(downloadHandlers);
}
