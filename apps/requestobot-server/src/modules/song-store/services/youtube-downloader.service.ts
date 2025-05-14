import { Inject, Injectable, Logger } from '@nestjs/common';
import { CreateSongEvent } from '../events/create-song.event';
import child_process from 'node:child_process';
import {
  DOWNLOADED_SONGS_PATH,
  STATIC_SITE_BASE_URL,
  YTDLP_PATH,
} from '../injection-tokens';
import { OnEvent } from '@nestjs/event-emitter';
import { promisify } from 'node:util';
import * as fs from 'node:fs';
import { SongService } from './song.service';

const exec = promisify(child_process.exec);

@Injectable()
export class YoutubeDownloaderService {
  private logger: Logger = new Logger(this.constructor.name);
  constructor(
    @Inject(YTDLP_PATH) private ytdlpPath: string,
    @Inject(DOWNLOADED_SONGS_PATH) private downloadedSongsPath: string,
    private songService: SongService,
    @Inject(STATIC_SITE_BASE_URL) private staticSiteBaseUrl: string
  ) {}

  @OnEvent(CreateSongEvent.name)
  async processYoutubeSong(songEvent: CreateSongEvent): Promise<void> {
    if (songEvent.song.game.name !== 'youtube') {
      this.logger.log('Not a youtube song');
      return;
    }

    if (songEvent.song.downloadUrl) {
      this.logger.log('downloadUrl is already populated, not downloading');
      return;
    }

    // We construct a youtube URL that yt-dlp can process, and get the audio track of the video to store locally.
    const url = `https://www.youtube.com/watch?v=${songEvent.song.songHash}`;

    // Tries to download the m4a audio file.  It's possible this may not be available all the time, so if this fails, we can
    // fall back to extracting the original video's audio track.
    const cmd = `${this.ytdlpPath} -f 140 --output "${this.downloadedSongsPath}/${songEvent.song.id}.%(ext)s" "${url}"`;
    this.logger.log('Downloading song', { cmd: cmd });
    const { stdout, stderr } = await exec(cmd);
    this.logger.log('Download complete', { stdout: stdout, stderr: stderr });
    const fileName = `${songEvent.song.id}.m4a`;
    const fullFilePath = `${this.downloadedSongsPath}/${fileName}`;

    if (!fs.existsSync(fullFilePath)) {
      this.logger.log(
        'File does not exist, falling back to extracting audio track'
      );

      // This will download the video, extract the audio and CONVERT it into m4a.  Use this if there's no audio track available directly.
      await exec(
        `${this.ytdlpPath} --extract-audio --audio-format m4a --audio-quality 0 --output "${this.downloadedSongsPath}/${songEvent.song.id}.%(ext)s" "${url}"`
      );

      // If we still don't have the file, we're out of luck.
      if (!fs.existsSync(fullFilePath)) {
        this.logger.log('File still does not exist, giving up');

        return;
      }
    }

    // We have the file, so we can update the song entity with the download URL.
    const song = songEvent.song;
    song.downloadUrl = `${this.staticSiteBaseUrl}/${fileName}`;
    song.dataSignature = this.songService.generateSongDataSignature(song);

    await this.songService.saveSong(song);

    this.logger.log('Updated song entity with downloadUrl', {
      downloadUrl: songEvent.song.downloadUrl,
    });
  }
}
