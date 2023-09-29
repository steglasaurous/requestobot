import { BotCommandInterface } from './bot-command.interface';
import { ChatMessage } from '../../chat/services/chat-message';
import { SongRequestService } from '../../song-request/services/song-request.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Channel } from '../../data-store/entities/channel.entity';
import { Repository } from 'typeorm';
import { I18nService } from 'nestjs-i18n';
import { MessageFormatterService } from '../services/message-formatter.service';
import { BaseBotCommand } from './base.bot-command';

export class OopsBotCommand extends BaseBotCommand {
  constructor(
    private songRequestService: SongRequestService,
    private i18n: I18nService,
  ) {
    super();
    this.triggers = ['!oops'];
  }
  async execute(channel: Channel, chatMessage: ChatMessage): Promise<string> {
    // Find the most recent request this user made on this channel, and remove it.
    const songRequest = await this.songRequestService.removeMostRecentRequest(
      channel,
      chatMessage.username,
    );
    if (songRequest) {
      return this.i18n.t('chat.RequestRemoved', {
        lang: channel.lang,
        args: { title: songRequest.song.title },
      });
    }

    return this.i18n.t('chat.NoUserSongRequestToRemove', {
      lang: channel.lang,
    });
  }

  getDescription(): string {
    return 'Requested the wrong song? This removes the last song request you made.';
  }
}
