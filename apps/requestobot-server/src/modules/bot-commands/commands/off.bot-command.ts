import { ChatMessage } from '@steglasaurous/chat';
import { InjectRepository } from '@nestjs/typeorm';
import { Channel } from '../../data-store/entities/channel.entity';
import { Repository } from 'typeorm';
import { I18nService } from 'nestjs-i18n';
import { Injectable } from '@nestjs/common';
import { BaseBotCommand } from './base.bot-command';

@Injectable()
export class OffBotCommand extends BaseBotCommand {
  constructor(
    @InjectRepository(Channel) private channelRepository: Repository<Channel>,
    private i18n: I18nService
  ) {
    super();
    this.triggers = ['!requestobot off'];
  }
  async execute(channel: Channel, chatMessage: ChatMessage): Promise<string> {
    // Only broadcaster and mods can use this.
    if (!chatMessage.userIsBroadcaster && !chatMessage.userIsMod) {
      return;
    }

    if (!channel.enabled) {
      // It's already disabled.  Let the user know.
      return this.i18n.t('chat.AlreadyOff', { lang: channel.lang });
    }

    channel.enabled = false;
    await this.channelRepository.save(channel);
    return this.i18n.t('chat.BotIsOff', { lang: channel.lang });
  }

  getDescription(): string {
    return 'This turns off all commands until you turn them back on with **!requestobot on**. This is a way of disabling the bot without removing it from your channel.';
  }

  shouldAlwaysTrigger(): boolean {
    return true;
  }
}
