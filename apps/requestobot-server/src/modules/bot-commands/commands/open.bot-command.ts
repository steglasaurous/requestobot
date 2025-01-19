import { ChatMessage } from '@steglasaurous/chat';
import { I18nService } from 'nestjs-i18n';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Channel } from '../../data-store/entities/channel.entity';
import { Repository } from 'typeorm';
import { BaseBotCommand } from './base.bot-command';

@Injectable()
export class OpenBotCommand extends BaseBotCommand {
  constructor(
    private i18n: I18nService,
    @InjectRepository(Channel) private channelRepository: Repository<Channel>
  ) {
    super();
    this.triggers = ['!open'];
  }
  async execute(channel: Channel, chatMessage: ChatMessage): Promise<string> {
    // Only broadcasters and mods should be allowed to do this.
    if (!chatMessage.userIsBroadcaster && !chatMessage.userIsMod) {
      return;
    }

    if (channel.queueOpen == true) {
      return this.i18n.t('chat.QueueAlreadyOpen', { lang: channel.lang });
    }

    channel.queueOpen = true;
    await this.channelRepository.save(channel);

    return this.i18n.t('chat.QueueOpen', { lang: channel.lang });
  }

  getDescription(): string {
    return 'Open the queue for requests from anyone.';
  }
}
