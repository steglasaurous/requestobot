import { SongSearchStrategyInterface } from './song-search-strategy.interface';
import { Song } from '../../../data-store/entities/song.entity';
import { Game } from '../../../data-store/entities/game.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class LocalStrategy implements SongSearchStrategyInterface {
  constructor(
    @InjectRepository(Song)
    private songRepository: Repository<Song>,
  ) {}
  async search(game: Game, query: string): Promise<Song[]> {
    // We handle spin differently as it can take requests in different forms.
    // See searchSpinRhythm() for more details
    if (game.name == 'spin_rhythm') {
      return this.searchSpinRhythm(game, query);
    }

    return this.searchGeneric(game, query);
  }

  private async searchGeneric(game: Game, query: string): Promise<Song[]> {
    // Do full-text search
    // See https://www.postgresql.org/docs/current/textsearch-controls.html
    return await this.songRepository
      .createQueryBuilder('song')
      .leftJoinAndSelect('song.game', 'game')
      .where(`"songSearch" @@ websearch_to_tsquery(:query)`)
      .andWhere(`"gameId" = :gameId`)
      .orderBy(`ts_rank("songSearch", websearch_to_tsquery(:query))`)
      .setParameter('query', query)
      .setParameter('gameId', game.id)
      .getMany();
  }

  private async searchSpinRhythm(game: Game, query: string): Promise<Song[]> {
    // Searches for spin can be a spinsha.re song id, a full spinsha.re URL, or just a generic query.

    // spinsha.re URL
    let songId = '';

    const spinshareUrlMatch = query.match(/spinsha\.re\/song\/([0-9]*)$/);
    if (spinshareUrlMatch) {
      songId = spinshareUrlMatch[1];
    }
    // Straight up song id
    const idMatch = query.match(/^[0-9]*$/);

    if (idMatch) {
      songId = idMatch[0];
    }

    if (songId != '') {
      return this.songRepository.findBy({ songHash: songId, game: game });
    }

    return this.searchGeneric(game, query);
  }

  supportsGame(game: Game): boolean {
    // Put exceptions here. Local should be the
    // fallback mechanism if no other
    // strategies are in use.
    return true;
  }
}
