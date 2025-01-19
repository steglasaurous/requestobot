import { ChatMessage } from '@steglasaurous/chat';
import { I18nService } from 'nestjs-i18n';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Channel } from '../../data-store/entities/channel.entity';
import { Repository } from 'typeorm';
import { BaseBotCommand } from './base.bot-command';

@Injectable()
export class CloseBotCommand extends BaseBotCommand {
  constructor(
    private i18n: I18nService,
    @InjectRepository(Channel) private channelRepository: Repository<Channel>
  ) {
    super();
    this.triggers = ['!close'];
  }
  async execute(channel: Channel, chatMessage: ChatMessage): Promise<string> {
    // Only broadcasters and mods should be allowed to do this.
    if (!chatMessage.userIsBroadcaster && !chatMessage.userIsMod) {
      return;
    }

    if (channel.queueOpen == false) {
      return this.i18n.t('chat.QueueAlreadyClosed', { lang: channel.lang });
    }

    channel.queueOpen = false;
    await this.channelRepository.save(channel);

    return this.i18n.t('chat.QueueClosed', { lang: channel.lang });
  }

  getDescription(): string {
    return "Close the queue from requests so viewers cannot add new requests to the queue. Note that the broadcaster and mods can still add requests even if it's closed.";
  }
}
