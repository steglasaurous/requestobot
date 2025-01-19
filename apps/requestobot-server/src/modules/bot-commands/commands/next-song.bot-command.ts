import { ChatMessage } from '@steglasaurous/chat';
import { SongRequestService } from '../../song-request/services/song-request.service';
import { Channel } from '../../data-store/entities/channel.entity';
import { I18nService } from 'nestjs-i18n';
import { BaseBotCommand } from './base.bot-command';
import { Inject } from '@nestjs/common';

export class NextSongBotCommand extends BaseBotCommand {
  constructor(
    @Inject(SongRequestService) private songRequestService: SongRequestService,
    private i18n: I18nService
  ) {
    super();
    this.triggers = ['!nextsong'];
  }
  async execute(channel: Channel, chatMessage: ChatMessage): Promise<string> {
    // Only broadcaster and mods can trigger this command.
    if (!chatMessage.userIsBroadcaster && !chatMessage.userIsMod) {
      return;
    }

    const nextRequest = await this.songRequestService.getNextRequest(channel);
    if (nextRequest) {
      return this.i18n.t('chat.NextRequest', {
        lang: channel.lang,
        args: {
          title: nextRequest.song.title,
          artist: nextRequest.song.artist,
          mapper: nextRequest.song.mapper,
          requesterName: nextRequest.requesterName,
        },
      });
    }

    return this.i18n.t('chat.QueueEmpty', {
      lang: channel.lang,
    });
  }

  getDescription(): string {
    return (
      'Add a song request to the queue. Use the song title to request a song. If more than one song matches, you will be presented with a list of matches, and can respond with **!req #1** to select the first song, **!req #2** to select the second song, etc.\n' +
      '\n' +
      'Also note using **!req** on its own will show instructions on how to request songs, and where to find songs for the current game.'
    );
  }
}
