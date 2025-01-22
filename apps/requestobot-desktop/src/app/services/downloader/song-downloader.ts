import { DownloadHandler } from './handlers/download-handler.interface';
import { SongDto } from '@requestobot/util-dto';
import { DownloadState, SettingName } from '@requestobot/util-client-common';
import { SettingsStoreService } from '../settings-store.service';
import { SynthRidersDownloadHandler } from './handlers/synth-riders-download-handler';
import { AudioTripDownloadHandler } from './handlers/audio-trip-download-handler';
import { SpinRhythmDownloadHandler } from './handlers/spin-rhythm-download-handler';

export class SongDownloader {
  constructor(
    private downloadHandlers: DownloadHandler[],
    private settingsStoreService: SettingsStoreService
  ) {
    this.settingsStoreService.on('settingChange', (key, value) => {
      switch (key) {
        case SettingName.synthSongsDir:
          this.getDownloadHandler(SynthRidersDownloadHandler).setSongsDir(
            value
          );
          break;
        case SettingName.audioTripSongsDir:
          this.getDownloadHandler(AudioTripDownloadHandler).setSongsDir(value);
          break;
        case SettingName.spinRhythmSongsDir:
          this.getDownloadHandler(SpinRhythmDownloadHandler).setSongsDir(value);
          break;
      }
    });
  }

  async processSong(song: SongDto, songStateCallback: any) {
    if (this.settingsStoreService.getValue(SettingName.autoDownloadEnabled)) {
      for (const downloadHandler of this.downloadHandlers) {
        if (downloadHandler.songSupported(song)) {
          if (downloadHandler.songIsLocal(song)) {
            // Song is already present, no need to download it.
            console.log('Song present', { songId: song.id, title: song.title });
            songStateCallback({
              songId: song.id,
              downloadState: DownloadState.Complete,
            });
            return;
          }
          await downloadHandler.downloadSong(song, songStateCallback);
        }
      }
    }
  }

  getDownloadHandler(handlerClass: any) {
    for (const downloadHandler of this.downloadHandlers) {
      if (downloadHandler instanceof handlerClass) {
        return downloadHandler;
      }
    }
  }
}
