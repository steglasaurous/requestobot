import { DownloadHandler } from './download-handler.interface';
import { SongDto } from '@requestobot/util-dto';
import { DownloadState, LocalSongState } from '@requestobot/util-client-common';
import * as fs from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';
import * as path from 'path';
import axios, { AxiosProgressEvent, AxiosResponse } from 'axios';

export class SynthRidersDownloadHandler implements DownloadHandler {
  constructor(private songsDir?: string) {
    const songsDirExists = fs.existsSync(songsDir);
    console.log('SynthRidersDownloadHandler', {
      songsDir: songsDir,
      songsDirExists: songsDirExists,
    });
  }

  setSongsDir(songsDir: string) {
    this.songsDir = songsDir;
  }

  getSongsDir(): string | null {
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
        console.log('Song does not have a downloadUrl', {
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
      const zipFilename = path.join(workDir, 'download' + song.id + '.synth');
      const writer = fs.createWriteStream(zipFilename);
      console.log('Downloading song', { songId: song.id, title: song.title });
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
            fs.copyFileSync(zipFilename, destination);
            fs.unlinkSync(zipFilename);
          });
        })
        .catch((e) => {
          console.log(`Failed to download ${song.downloadUrl}`, {
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
    const isLocal = fs.existsSync(this.getSongDir(song));
    console.log('SynthRidersDownloadHandler::songIsLocal', {
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
