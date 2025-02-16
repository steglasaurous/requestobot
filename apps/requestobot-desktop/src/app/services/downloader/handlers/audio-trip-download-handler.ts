import { DownloadHandler } from './download-handler.interface';
import { SongDto } from '@requestobot/util-dto';
import { DownloadState, LocalSongState } from '@requestobot/util-client-common';
import * as fs from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';
import * as path from 'path';
import axios, { AxiosProgressEvent, AxiosResponse } from 'axios';
import decompress from 'decompress';
import log from 'electron-log/main';

export class AudioTripDownloadHandler implements DownloadHandler {
  constructor(private songsDir?: string) {
    if (!this.songsDir) {
      if (process.platform == 'win32') {
        const appData = process.env['APPDATA'];
        this.songsDir =
          appData.replace('Roaming', 'LocalLow') +
          '\\Kinemotik Studios\\Audio Trip\\Songs';
      }
    }
  }

  setSongsDir(songsDir: string): void {
    this.songsDir = songsDir;
  }
  getSongsDir(): string {
    return this.songsDir;
  }

  downloadSong(song: SongDto, songStateCallback: any): Promise<void> {
    return new Promise((resolve, reject) => {
      const songState: LocalSongState = {
        songId: song.id,
        downloadState: DownloadState.Waiting,
        downloadProgress: 0,
      };
      if (!song.downloadUrl) {
        log.warn('Song does not have a downloadUrl', {
          songId: song.id,
          title: song.title,
        });
        // Nothing to download.
        songState.downloadState = DownloadState.Complete;
        songStateCallback(songState);
        resolve();
        return;
      }

      const workDir = fs.mkdtempSync(join(tmpdir(), 'queuebot-'));
      const zipFilename = path.join(workDir, 'download' + song.id + '.zip');
      const writer = fs.createWriteStream(zipFilename);
      log.debug('Downloading song', { songId: song.id, title: song.title });
      axios({
        method: 'get',
        url: song.downloadUrl,
        responseType: 'stream',
        onDownloadProgress: (progressEvent: AxiosProgressEvent) => {
          songState.downloadState = DownloadState.InProgress;
          songState.downloadProgress = progressEvent.progress;
          songStateCallback(songState);
        },
      })
        .then((response: AxiosResponse<any, any>) => {
          response.data.pipe(writer);
          writer.on('finish', () => {
            // NOTE: The IDE says this is an error, but the compiler does not.  Ignore the IDE in this case.
            // @ts-ignore
            const destination = this.getSongDir(song);
            fs.mkdirSync(destination);

            decompress(zipFilename, destination).then(() => {
              log.debug('Decompressing done');
              songState.downloadState = DownloadState.Complete;
              songStateCallback(songState);
              resolve();
            });
          });
        })
        .catch((e) => {
          log.warn(`Failed to download ${song.downloadUrl}`, {
            error: e,
            songId: song.id,
            title: song.title,
          });
          songState.downloadState = DownloadState.Failed;
          songStateCallback(songState);
          reject(e);
        });
    });
  }

  songIsLocal(song: SongDto): boolean {
    return fs.existsSync(this.getSongDir(song));
  }

  songSupported(song: SongDto): boolean {
    return song.gameName == 'audio_trip';
  }

  private getSongDir(song: SongDto): string {
    return this.songsDir + '\\' + song.id;
  }
}
