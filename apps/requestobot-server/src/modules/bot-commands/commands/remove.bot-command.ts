import { BaseBotCommand } from './base.bot-command';
import { Channel } from '../../data-store/entities/channel.entity';
import { ChatMessage } from '@steglasaurous/chat';
import { I18nService } from 'nestjs-i18n';
import { Injectable } from '@nestjs/common';
import { SongRequestService } from '../../song-request/services/song-request.service';

@Injectable()
export class RemoveBotCommand extends BaseBotCommand {
  constructor(
    private i18n: I18nService,
    private songRequestService: SongRequestService
  ) {
    super();

    this.triggers = ['!remove'];
  }

  async execute(channel: Channel, chatMessage: ChatMessage): Promise<string> {
    const searchTerms = chatMessage.message
      .trim()
      .substring(chatMessage.message.indexOf(' ') + 1)
      .trim();

    const searchSongNumberResult = searchTerms.match(
      /^#(?<songRequestNumber>[0-9]?)/
    );
    if (!searchSongNumberResult) {
      return this.i18n.t('chat.InvalidSongRequestNumber', {
        lang: channel.lang,
      });
    }

    const songRequestNumber: number = parseInt(
      searchSongNumberResult.groups.songRequestNumber.replace('#', '')
    );

    if (songRequestNumber < 1 || isNaN(songRequestNumber)) {
      return this.i18n.t('chat.InvalidSongRequestNumber', {
        lang: channel.lang,
      });
    }

    const songRequests = await this.songRequestService.getAllRequests(channel);

    if (songRequests.length < songRequestNumber) {
      return this.i18n.t('chat.InvalidSongRequestNumber', {
        lang: channel.lang,
      });
    }
    const songRequestToRemove = songRequests[songRequestNumber - 1];

    if (!chatMessage.userIsMod && !chatMessage.userIsBroadcaster) {
      if (chatMessage.username != songRequestToRemove.requesterName) {
        return this.i18n.t('chat.OnlyRemoveOwnSongs', {
          lang: channel.lang,
        });
      }
    }

    await this.songRequestService.removeRequest(songRequestToRemove);

    return this.i18n.t('chat.SongRequestRemoved', {
      lang: channel.lang,
      args: {
        title: songRequestToRemove.song.title,
        artist: songRequestToRemove.song.artist,
        mapper: songRequestToRemove.song.mapper,
        requesterName: songRequestToRemove.requesterName,
      },
    });
  }

  getDescription(): string {
    return 'Removes a song request from the request queue by position number, starting from 1.';
  }
}
