import { DownloadHandler } from './download-handler.interface';
import { SongDto } from '@requestobot/util-dto';
import { DownloadState, LocalSongState } from '@requestobot/util-client-common';
import * as fs from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';
import * as path from 'path';
import axios, { AxiosProgressEvent, AxiosResponse } from 'axios';
import log from 'electron-log/main';

export class SynthRidersDownloadHandler implements DownloadHandler {
  private defaultSongsDirWin32 =
    'C:\\Program Files (x86)\\Steam\\steamapps\\common\\SynthRiders\\SynthRidersUC\\CustomSongs';
  constructor(private songsDir?: string) {
    const songsDirExists = fs.existsSync(songsDir);
    if (!songsDir || !songsDirExists) {
      if (process.platform == 'win32') {
        if (fs.existsSync(this.defaultSongsDirWin32)) {
          this.songsDir = this.defaultSongsDirWin32;
        } else {
          this.songsDir = undefined;
        }
      }
    }
  }

  setSongsDir(songsDir: string) {
    this.songsDir = songsDir;
  }

  getSongsDir(): string | undefined {
    return this.songsDir;
  }

  downloadSong(song: SongDto, songStateCallback: any): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.songsDir) {
        resolve();
        return;
      }

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
      const synthFile = path.join(workDir, 'download' + song.id + '.synth');
      const writer = fs.createWriteStream(synthFile);
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
            // Simply move the file to the destination and that's that.
            const destination = this.getSongDir(song);
            fs.copyFileSync(synthFile, destination);
            fs.unlinkSync(synthFile);
            songState.downloadState = DownloadState.Complete;
            songState.downloadProgress = 1;
            songStateCallback(songState);
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
    if (!this.songsDir) {
      return false;
    }

    const isLocal = fs.existsSync(this.getSongDir(song));
    log.debug('SynthRidersDownloadHandler::songIsLocal', {
      isLocal: isLocal,
      filePath: this.getSongDir(song),
    });
    return isLocal;
  }

  songSupported(song: SongDto): boolean {
    return song.gameName == 'synth_riders';
  }

  private getSongDir(song: SongDto): string {
    return path.join(this.songsDir, song.fileReference);
  }
}
