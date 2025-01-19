import { Game } from '../../../data-store/entities/game.entity';
import { Song } from '../../../data-store/entities/song.entity';

export interface SongSearchStrategyInterface {
  supportsGame(game: Game): boolean;
  search(game: Game, query: string): Promise<Song[]>;
}
