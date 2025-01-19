import { ChatMessage } from '@steglasaurous/chat';
import { SongRequestService } from '../../song-request/services/song-request.service';
import { Channel } from '../../data-store/entities/channel.entity';
import { I18nService } from 'nestjs-i18n';
import { Injectable, Logger } from '@nestjs/common';
import { BaseBotCommand } from './base.bot-command';

@Injectable()
export class QueueBotCommand extends BaseBotCommand {
  private logger: Logger = new Logger(this.constructor.name);
  constructor(
    private songRequestService: SongRequestService,
    private i18n: I18nService
  ) {
    super();
    this.triggers = ['!queue', '!q'];
  }
  async execute(channel: Channel, chatMessage: ChatMessage): Promise<string> {
    const songRequests = await this.songRequestService.getAllRequests(channel);
    if (songRequests.length == 0) {
      return this.i18n.t('chat.QueueEmpty', { lang: channel.lang });
    }

    // Spit out up to 5 songs.
    let output = '';
    let requestCountLimit = 5;
    if (songRequests.length < 5) {
      requestCountLimit = songRequests.length;
    }
    this.logger.debug('!queue', {
      songRequests: songRequests,
      requestCountLimit: requestCountLimit,
    });
    for (let i = 0; i < requestCountLimit; i++) {
      output += `#${i + 1} ${songRequests[i].song.title} - ${
        songRequests[i].song.artist
      } (${songRequests[i].song.mapper}) `;
    }

    if (songRequests.length > requestCountLimit) {
      output += this.i18n.t('chat.AndMore', {
        lang: channel.lang,
        args: { songsRemaining: songRequests.length - requestCountLimit },
      });
    }

    return output;
  }

  getDescription(): string {
    return 'Shows the list of songs in the queue. If the queue is too long, only the top 5 songs are shown, with a count of how many additional songs there are.';
  }
}
