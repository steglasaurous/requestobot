import { SongSearchStrategyInterface } from './song-search-strategy.interface';
import { Song } from '../../../data-store/entities/song.entity';
import { Game } from '../../../data-store/entities/game.entity';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class SpinRhythmSearchStrategy implements SongSearchStrategyInterface {
  private logger: Logger = new Logger(this.constructor.name);
  constructor(private readonly httpService: HttpService) {}

  async search(game: Game, query: string): Promise<Song[]> {
    // If we get a number, we can interpret as a search by id and just use that directly.
    // Otherwise, fallback to standard search.
    // Check for a full spinshare URL and pull out the id if the user pasted in a URL
    let songId = '';

    this.logger.debug('Spin search', { query: query });

    const spinshareUrlMatch = query.match(/spinsha\.re\/song\/([0-9]*)$/);
    this.logger.debug('spinshareUrlMatch', spinshareUrlMatch);
    if (spinshareUrlMatch) {
      songId = spinshareUrlMatch[1];
    }
    const idMatch = query.match(/^[0-9]*$/);
    this.logger.debug('idMatch', idMatch);
    if (idMatch) {
      songId = idMatch[0];
    }

    if (songId != '') {
      this.logger.debug('Getting specific song from spinshare', {
        songId: songId,
      });
      const songIdResult = await firstValueFrom(
        this.httpService.get('https://spinsha.re/api/song/' + songId),
      );
      // FIXME: Apparently this can come back with an empty response or something that makes it try to insert an empty song?
      // Try with example: !req 1
      if (songIdResult.data.data) {
        return [this.getSongFromData(game, songIdResult.data.data)];
      } else {
        return [];
      }
    }

    this.logger.debug('Querying spinshare', { query: query });

    const result = await firstValueFrom(
      this.httpService.post('https://spinsha.re/api/searchCharts', {
        searchQuery: query,
      }),
    );
    this.logger.debug('spinshare result', {
      resultStatus: result.status,
      data: result.data,
    });

    if (result.status > 399) {
      // Something went wrong.  Throw an error so the caller can catch it and handle accordingly.
      throw new Error(
        JSON.stringify({
          status: result.status,
          statusText: result.statusText,
        }),
      );
    }
    // Parse results, but get about 10 results.  Don't try to boil the ocean.
    return result.data.data.map((resultItem) => {
      // No bpm or duration - future consideration: Pull down the song in a separate async process and pick it out of the song itself?
      return this.getSongFromData(game, resultItem);
    });
  }

  supportsGame(game: Game): boolean {
    return game.name == 'spin_rhythm';
  }

  private getSongFromData(game: Game, data: any): Song {
    const song = new Song();
    song.game = game;
    song.songHash = data.id;
    song.title = data.title;
    song.artist = data.artist;
    song.mapper = data.charter;
    song.downloadUrl = data.zip;
    song.fileReference = data.fileReference;

    this.logger.log('Song object', JSON.stringify(song));

    return song;
  }
}
