import { ChatMessage } from '@steglasaurous/chat';
import { I18nService } from 'nestjs-i18n';
import { Injectable } from '@nestjs/common';
import { Channel } from '../../data-store/entities/channel.entity';
import { SongRequestService } from '../../song-request/services/song-request.service';
import { BaseBotCommand } from './base.bot-command';

@Injectable()
export class ClearBotCommand extends BaseBotCommand {
  constructor(
    private i18n: I18nService,
    private songRequestService: SongRequestService
  ) {
    super();
    this.triggers = ['!clear'];
  }

  getDescription(): string {
    return 'For broadcasters and mods only. This completely clears the request queue.';
  }

  async execute(channel: Channel, chatMessage: ChatMessage): Promise<string> {
    // Only broadcasters and mods should be allowed to do this.
    if (!chatMessage.userIsBroadcaster && !chatMessage.userIsMod) {
      return;
    }

    await this.songRequestService.clearAllRequests(channel);
    return this.i18n.t('chat.QueueCleared', { lang: channel.lang });
  }
}
