import { Inject, Injectable, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Song } from '../../data-store/entities/song.entity';
import { Game } from '../../data-store/entities/game.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as crypto from 'node:crypto';
import { SongSearchStrategyInterface } from './song-search-strategies/song-search-strategy.interface';
import { SONG_SEARCH_STRATEGIES } from '../injection-tokens';
import { BotStateService } from '../../data-store/services/bot-state.service';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class SongService {
  private hashes: string[] = [];
  constructor(
    @InjectRepository(Song)
    private songRepository: Repository<Song>,
    @Inject(SONG_SEARCH_STRATEGIES)
    private searchStrategies: SongSearchStrategyInterface[],
    private botStateService: BotStateService,
    private i18n: I18nService
  ) {}

  async searchSongs(
    query: string,
    game: Game,
    username: string,
    channelName: string
  ): Promise<Song[]> {
    // If the query is in the form of #1, #2, etc, look at the last search state
    const searchSongNumberResult = query.match(/^#(?<songNumber>[0-9]?)/);
    const userBotState = await this.botStateService.getState(
      username,
      channelName
    );

    if (searchSongNumberResult && userBotState.state) {
      const previousResults = userBotState.state['lastQueryResults'];

      let matchedSong: Song | undefined;
      if (previousResults) {
        matchedSong =
          previousResults[
            parseInt(searchSongNumberResult.groups.songNumber) - 1
          ];

        if (matchedSong !== undefined) {
          return [matchedSong];
        }
      }

      return [];
    }

    for (const strategy of this.searchStrategies) {
      if (strategy.supportsGame(game)) {
        const searchResults = await strategy.search(game, query);
        if (searchResults.length > 1) {
          await this.botStateService.setState(username, channelName, {
            lastQueryResults: searchResults,
          });
        }

        return searchResults;
      }
    }

    return [];
  }

  /**
   * In the case where multiple songs are matched, this constructs the output
   * message used by the bot to show the available matches that can be requested
   * via !req #1, !req #2, etc.
   *
   * @param lang
   * @param searchResults
   * FIXME: Consider moving this to its own class?
   */
  getSongSelectionOutput(lang = 'en', searchResults: Song[]): string {
    let outputMessage = this.i18n.t('chat.SelectSong', {
      lang: lang,
    });
    let songLimit = 5;
    if (searchResults.length < 5) {
      songLimit = searchResults.length;
    }
    for (let i = 0; i < songLimit; i++) {
      outputMessage += `#${i + 1} ${searchResults[i].title} - ${
        searchResults[i].artist
      } (${searchResults[i].mapper}) `;
    }
    if (searchResults.length > songLimit) {
      outputMessage += this.i18n.t('chat.AndMore', {
        lang: lang,
        args: { songsRemaining: searchResults.length - songLimit },
      });
    }

    return outputMessage;
  }

  createSongEntity(
    game: Game,
    title: string,
    artist: string,
    mapper: string,
    hash?: string,
    downloadUrl?: string,
    bpm?: number,
    duration?: number,
    fileReference?: string,
    coverArtUrl?: string
  ): Song {
    if (!hash) {
      hash = crypto
        .createHash('sha256')
        .update(JSON.stringify(game.name + title + artist + mapper))
        .digest('hex');
    }

    const song = new Song();
    song.game = game;
    song.songHash = hash;
    song.artist = artist;
    song.title = title;
    song.mapper = mapper;
    song.downloadUrl = downloadUrl;
    song.bpm = bpm;
    song.duration = duration;
    song.fileReference = fileReference;
    song.coverArtUrl = coverArtUrl;
    song.dataSignature = this.generateSongDataSignature(song);

    return song;
  }

  generateSongDataSignature(song: Song) {
    return crypto
      .createHash('sha256')
      .update(
        song.title +
          song.artist +
          song.mapper +
          song.downloadUrl +
          song.bpm +
          song.duration +
          song.fileReference +
          song.coverArtUrl
      )
      .digest('hex');
  }

  async saveSong(song: Song, updateExisting = true): Promise<Song> {
    // Because this all happens asynchronously, we can have a shitload of inserts happening
    // all at once.  This helps to deal with dupes within the dataset itself (of which do exist in sources like
    // the audio trip spreadsheet.
    if (this.hashes.includes(song.songHash)) {
      return;
    }

    this.hashes.push(song.songHash);

    const existingSong = await this.songRepository.findOneBy({
      game: song.game,
      songHash: song.songHash,
    });

    if (existingSong && updateExisting) {
      // Do an update on this.
      existingSong.title = song.title;
      existingSong.artist = song.artist;
      existingSong.mapper = song.mapper;
      existingSong.downloadUrl = song.downloadUrl;
      existingSong.bpm = song.bpm;
      existingSong.duration = song.duration;
      existingSong.coverArtUrl = song.coverArtUrl;
      return await this.songRepository.save(existingSong);
    }

    return await this.songRepository.save(song);
  }

  async getSongBySongHash(
    game: Game,
    songHash: string
  ): Promise<Song | undefined> {
    return await this.songRepository.findOneBy({
      game: game,
      songHash: songHash,
    });
  }

  async getSongHashesAndDataSignatures(
    game: Game
  ): Promise<Map<string, string>> {
    const outputMap = new Map<string, string>();

    const result = await this.songRepository.query(
      `SELECT "songHash", "dataSignature" from "song" where "gameId" = ${game.id}`
    );

    for (const keyPair of result) {
      outputMap.set(keyPair['songHash'], keyPair['dataSignature']);
    }

    return outputMap;
  }
}
