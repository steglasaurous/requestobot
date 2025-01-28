import { ChatMessage, MessageFormatterService } from '@steglasaurous/chat';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Channel } from '../../data-store/entities/channel.entity';
import { I18nService } from 'nestjs-i18n';
import { BaseBotCommand } from './base.bot-command';
import { ChannelManagerService } from '../../channel-manager/services/channel-manager.service';

@Injectable()
export class JoinChannelBotCommand extends BaseBotCommand {
  private logger: Logger = new Logger(JoinChannelBotCommand.name);

  constructor(
    @Inject('BOT_CHANNEL_NAME') private botChannelName: string,
    private readonly i18n: I18nService,
    private channelManagerService: ChannelManagerService
  ) {
    super();
    this.triggers = ['!join'];
  }

  async execute(channel: Channel, chatMessage: ChatMessage): Promise<string> {
    // Check if channel is in the db list, add it if necessary.
    let channelNameEntity = await this.channelManagerService.getChannel(
      chatMessage.username,
      chatMessage.client.chatServiceName
    );
    if (channelNameEntity && channelNameEntity.inChannel == true) {
      // They're already in the channel - no need to join again.
      return this.i18n.t('chat.AlreadyJoined', { lang: channel.lang });
    }

    if (!channelNameEntity) {
      channelNameEntity = await this.channelManagerService.createChannel(
        chatMessage.username,
        chatMessage.client.chatServiceName
      );
    } else {
      await this.channelManagerService.joinChannel(channelNameEntity);
    }

    return this.i18n.t('chat.JoinedChannel', {
      lang: channel.lang,
      args: { channelName: channelNameEntity.channelName },
    });
  }

  matchesTrigger(chatMessage: ChatMessage): boolean {
    // Should only match the !join command from the bot's channel.
    return (
      chatMessage.channelName == this.botChannelName &&
      chatMessage.message == this.triggers[0]
    );
  }

  getDescription(): string {
    return "Broadcasters only.  Ask the bot to join your channel. This must be used in requestobot's channel to have it join your channel.";
  }

  shouldAlwaysTrigger(): boolean {
    return true;
  }
}
