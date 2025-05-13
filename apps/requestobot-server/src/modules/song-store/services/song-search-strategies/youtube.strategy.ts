import { Game } from '../../../data-store/entities/game.entity';
import { Song } from '../../../data-store/entities/song.entity';
import { SongSearchStrategyInterface } from './song-search-strategy.interface';
import { YoutubeUrlValidator } from '../../utils/youtube-url.validator';
import { Injectable, Logger } from '@nestjs/common';
import { SongService } from '../song.service';
import child_process from 'node:child_process';
import { promisify } from 'node:util';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CreateSongEvent } from '../../events/create-song.event';
const exec = promisify(child_process.exec);

@Injectable()
export class YoutubeStrategy implements SongSearchStrategyInterface {
  private logger: Logger = new Logger(this.constructor.name);
  // FIXME: COntinue here - add appropriate logs, then continue on yt-dlp stuff

  constructor(
    private youtubeUrlValidator: YoutubeUrlValidator,
    private songService: SongService,
    private eventEmitter: EventEmitter2
  ) {}
  supportsGame(game: Game): boolean {
    return game.name === 'youtube';
  }
  async search(game: Game, query: string): Promise<Song[]> {
    // We expect searches to contain youtube links.  If we can't
    // resolve the link, reject the search.
    if (!this.youtubeUrlValidator.isValidYoutubeUrl(query)) {
      this.logger.log('Invalid youtube url', { query: query });
      return [];
    }

    // Once we validate the link, see if we have this video
    // in the database already.  If we do, return it.
    const videoId = this.youtubeUrlValidator.getYoutubeVideoId(query);
    if (videoId === null) {
      this.logger.log('Unable to extract videoId from youtube url', {
        query: query,
      });
      return [];
    }

    const existingSong = await this.songService.getSongBySongHash(
      game,
      videoId
    );
    if (existingSong) {
      return [existingSong];
    }

    // If we don't have the song, use yt-dlp to get the song title.
    // yt-dlp --write-info-json --skip-download URL
    // Title is in "title" in the root of the object.
    // Get duration, coverArtUrl if available
    // "thumbnail" -> URL to cover art
    // "duration" -> in seconds
    // const { stderr, stdout } = await exec('yt-dlp --skip-download --print title "' + query + '"');
    const { stderr, stdout } = await exec(
      'yt-dlp --skip-download --dump-json "' + query + '"'
    );
    const videoMetadata = JSON.parse(stdout);
    if (!videoMetadata) {
      this.logger.log('Retrieving youtube video metadata failed', {
        stdout: stdout,
        stderr: stderr,
      });

      return [];
    }

    // Insert it into the song database so we can return the promise and get back
    // to the user quickly.
    const song = this.songService.createSongEntity(
      game,
      videoMetadata.title,
      '',
      '',
      videoId,
      undefined,
      undefined,
      videoMetadata.duration,
      undefined,
      videoMetadata.thumbnail
    );

    await this.songService.saveSong(song);
    // Emit an event so the youtube importer can pull down an audio version of the
    // video and store it for later playback.
    this.eventEmitter.emit(CreateSongEvent.name, {
      song: song,
    });

    return [song];
  }
}
