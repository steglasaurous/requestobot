import { DownloadHandler } from './handlers/download-handler.interface';
import { SongDto } from '@requestobot/util-dto';
import { DownloadState } from '@requestobot/util-client-common';

export class SongDownloader {
  constructor(private downloadHandlers: DownloadHandler[]) {}

  async processSong(song: SongDto, songStateCallback: any) {
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

  getDownloadHandler(handlerName: string) {
    for (const downloadHandler of this.downloadHandlers) {
      if (downloadHandler.constructor.name == handlerName) {
        return downloadHandler;
      }
    }
  }
}
