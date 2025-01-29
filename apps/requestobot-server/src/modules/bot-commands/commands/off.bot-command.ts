import { ChatMessage } from '@steglasaurous/chat';
import { InjectRepository } from '@nestjs/typeorm';
import { Channel } from '../../data-store/entities/channel.entity';
import { Repository } from 'typeorm';
import { I18nService } from 'nestjs-i18n';
import { Injectable } from '@nestjs/common';
import { BaseBotCommand } from './base.bot-command';
import { ChannelManagerService } from '../../channel-manager/services/channel-manager.service';

@Injectable()
export class OffBotCommand extends BaseBotCommand {
  constructor(
    private i18n: I18nService,
    private channelManager: ChannelManagerService
  ) {
    super();
    this.triggers = ['!requestobot off'];
  }
  async execute(channel: Channel, chatMessage: ChatMessage): Promise<string> {
    // Only broadcaster and mods can use this.
    if (!chatMessage.userIsBroadcaster && !chatMessage.userIsMod) {
      return null;
    }

    if (!channel.enabled) {
      // It's already disabled.  Let the user know.
      return this.i18n.t('chat.AlreadyOff', { lang: channel.lang });
    }

    await this.channelManager.disableBot(channel);

    return null;
  }

  getDescription(): string {
    return 'This turns off all commands until you turn them back on with **!requestobot on**. This is a way of disabling the bot without removing it from your channel.';
  }

  shouldAlwaysTrigger(): boolean {
    return true;
  }
}
