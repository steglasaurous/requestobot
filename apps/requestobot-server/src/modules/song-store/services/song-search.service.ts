import { Game } from '../../data-store/entities/game.entity';
import { Song } from '../../data-store/entities/song.entity';
import { Inject, Injectable } from '@nestjs/common';
import { SONG_SEARCH_STRATEGIES } from '../injection-tokens';
import { SongSearchStrategyInterface } from './song-search-strategies/song-search-strategy.interface';
import { BotStateService } from '../../data-store/services/bot-state.service';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class SongSearchService {
  constructor(
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
}
