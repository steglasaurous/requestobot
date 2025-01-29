import { ChatMessage, MessageFormatterService } from '@steglasaurous/chat';
import { I18nService } from 'nestjs-i18n';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Channel } from '../../data-store/entities/channel.entity';
import { Repository } from 'typeorm';
import { BaseBotCommand } from './base.bot-command';
import { ChannelManagerService } from '../../channel-manager/services/channel-manager.service';

@Injectable()
export class GetOutBotCommand extends BaseBotCommand {
  constructor(private channelManagerService: ChannelManagerService) {
    super();
    this.triggers = ['!getout'];
  }
  async execute(channel: Channel, chatMessage: ChatMessage): Promise<string> {
    // Only broadcasters and mods should be allowed to do this.
    if (!chatMessage.userIsBroadcaster && !chatMessage.userIsMod) {
      return;
    }

    await this.channelManagerService.leaveChannel(channel);

    // Done.
    return;
  }

  getDescription(): string {
    return 'Broadcaster and mods only. Have requestobot leave your channel. Once left, commands will not work until you invite the bot into your channel again.';
  }

  shouldAlwaysTrigger(): boolean {
    return true;
  }
}
