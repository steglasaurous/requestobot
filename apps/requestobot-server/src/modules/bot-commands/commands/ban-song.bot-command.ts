import { Injectable, Logger } from '@nestjs/common';
import { BaseBotCommand } from './base.bot-command';
import { I18nService } from 'nestjs-i18n';
import { InjectRepository } from '@nestjs/typeorm';
import { SongBan } from '../../data-store/entities/song-ban.entity';
import { Repository } from 'typeorm';
import { Channel } from '../../data-store/entities/channel.entity';
import { ChatMessage } from '@steglasaurous/chat';
import { Song } from '../../data-store/entities/song.entity';
import { SongService } from '../../song-store/services/song.service';

@Injectable()
export class BanSongBotCommand extends BaseBotCommand {
  private logger: Logger = new Logger();

  constructor(
    private i18n: I18nService,
    @InjectRepository(SongBan) private songBanRepository: Repository<SongBan>,
    private songService: SongService
  ) {
    super();
    this.triggers = ['!addsongban'];
  }

  getDescription(): string {
    return 'Adds a song to the ban list';
  }

  async execute(channel: Channel, chatMessage: ChatMessage): Promise<string> {
    // Only mods or broadcasters can use this.
    if (!chatMessage.userIsBroadcaster && !chatMessage.userIsMod) {
      return;
    }

    const searchTerms = chatMessage.message
      .trim()
      .substring(chatMessage.message.indexOf(' ') + 1)
      .trim();

    let searchResults: Song[];
    try {
      searchResults = await this.songService.searchSongs(
        searchTerms,
        channel.game,
        chatMessage.username,
        chatMessage.channelName
      );
    } catch (err) {
      this.logger.warn('searchSongs returned an error', err); // FIXME: put more context around the error.

      // Let the user know something borked and try again.
      return this.i18n.t('chat.SearchErrorTryAgain', { lang: channel.lang });
    }

    if (searchResults.length < 1) {
      return this.i18n.t('chat.NoSongsFound', { lang: channel.lang });
    }

    if (searchResults.length == 1) {
      const songBan = new SongBan();
      songBan.song = searchResults[0];
      songBan.channel = channel;

      try {
        await this.songBanRepository.save(songBan);
      } catch (e) {
        if (e.code == '23505') {
          // Assume this is already in the ban list.
          return this.i18n.t('chat.SongAlreadyInBanList');
        }

        this.logger.warn('Adding song to ban list threw database error', {
          e: e,
        });
        return this.i18n.t('chat.AddToBanListError', { lang: channel.lang });
      }

      return this.i18n.t('chat.SongAddedToBanList', {
        lang: channel.lang,
        args: {
          title: searchResults[0].title,
          artist: searchResults[0].artist,
          mapper: searchResults[0].mapper,
        },
      });
    } else if (searchResults.length > 1) {
      return this.songService.getSongSelectionOutput(
        channel.lang,
        searchResults
      );
    }
  }
}
