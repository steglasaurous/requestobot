import { Game } from '../../../data-store/entities/game.entity';
import { Song } from '../../../data-store/entities/song.entity';
import { SongSearchStrategyInterface } from './song-search-strategy.interface';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { SongService } from '../song.service';

@Injectable()
export class FreeformStrategy implements SongSearchStrategyInterface {
  private logger: Logger = new Logger(this.constructor.name);
  constructor(@Inject(SongService) private songService: SongService) {}

  supportsGame(game: Game): boolean {
    this.logger.log('freeform strategy supportsGame', { gameName: game.name });

    return game.name === 'freeform';
  }

  async search(game: Game, query: string): Promise<Song[]> {
    this.logger.log('Freeform search', { query: query });
    // This strategy will 'create' a song of whatever the user tells us.  It'll ultimately
    // just be text.  This is useful for freeform requests where a database of songs is
    // unavailable.
    const song = this.songService.createSongEntity(game, query, '', '', query);
    this.logger.log(song);

    // Write the "song" to the database.  We'll have to write something that cleans this up later
    // so we don't get a ton of bullshit song entries.
    // May also need to 'filter' what's requested for shitty language. (you watch your mouth)
    await this.songService.saveSong(song);

    return [song];
  }
}
