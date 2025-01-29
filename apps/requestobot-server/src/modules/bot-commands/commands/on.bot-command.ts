import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Channel } from '../../data-store/entities/channel.entity';
import { Repository } from 'typeorm';
import { I18nService } from 'nestjs-i18n';
import { ChatMessage } from '@steglasaurous/chat';
import { BaseBotCommand } from './base.bot-command';
import { ChannelManagerService } from '../../channel-manager/services/channel-manager.service';

@Injectable()
export class OnBotCommand extends BaseBotCommand {
  constructor(
    private i18n: I18nService,
    private channelManager: ChannelManagerService
  ) {
    super();
    this.triggers = ['!requestobot on'];
  }

  async execute(channel: Channel, chatMessage: ChatMessage): Promise<string> {
    // Only broadcaster and mods can use this.
    if (!chatMessage.userIsBroadcaster && !chatMessage.userIsMod) {
      return null;
    }

    if (channel.enabled) {
      return this.i18n.t('chat.AlreadyOn', { lang: channel.lang });
    }
    await this.channelManager.enableBot(channel);

    return null;
  }

  getDescription(): string {
    return 'Enable the bot to respond to commands in your channel.';
  }

  shouldAlwaysTrigger(): boolean {
    return true;
  }
}
