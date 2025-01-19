import { Injectable, Logger } from '@nestjs/common';
import { ChatManagerService, ChatServiceName } from '@steglasaurous/chat';
import { InjectRepository } from '@nestjs/typeorm';
import { Channel } from '../../data-store/entities/channel.entity';
import { Repository } from 'typeorm';
import { Game } from '../../data-store/entities/game.entity';
import { I18nService } from 'nestjs-i18n';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { Metrics } from '../../bot-commands/models/metrics.enum';
import { Counter, Gauge } from 'prom-client';

/**
 * Manages creating, joining and leaving channels, handling any chat messages that need to be emitted as well as
 * tracking metrics and emitting internal events as needed.
 */
@Injectable()
export class ChannelManagerService {
  private logger: Logger = new Logger(this.constructor.name);
  constructor(
    private chatManagerService: ChatManagerService,
    @InjectRepository(Game) private gameRepository: Repository<Game>,
    @InjectRepository(Channel) private channelRepository: Repository<Channel>,
    private readonly i18n: I18nService,
    @InjectMetric(Metrics.ChannelsTotal) private channelsTotal: Gauge,
    @InjectMetric(Metrics.ChannelJoinedCounterTotal)
    private channelsJoinedCounterTotal: Counter,
    @InjectMetric(Metrics.ChannelsJoinedTotal)
    private channelsJoinedTotal: Gauge,
    @InjectMetric(Metrics.ChannelsBotEnabledTotal)
    private channelsBotEnabledTotal: Gauge,
    @InjectMetric(Metrics.ChannelLeftCounterTotal)
    private channelLeftCounterTotal: Counter
  ) {}

  async getChannel(
    channelName: string,
    chatServiceName: ChatServiceName
  ): Promise<Channel | null> {
    return await this.channelRepository.findOneBy({
      channelName: channelName,
      chatServiceName: chatServiceName,
    });
  }

  async getChannelById(channelId: number): Promise<Channel | null> {
    return await this.channelRepository.findOneBy({ id: channelId });
  }

  async createChannel(
    channelName: string,
    chatServiceName: ChatServiceName = ChatServiceName.TWITCH,
    lang = 'en',
    inChannel = true,
    queueOpen = true,
    enabled = true,
    game: Game | null = null
  ): Promise<Channel> {
    let channel = await this.getChannel(channelName, chatServiceName);

    if (!channel) {
      this.logger.debug('Creating new channel', {
        channelName: channelName,
        chatServiceName: chatServiceName,
      });
      channel = new Channel();
      channel.channelName = channelName;
      channel.chatServiceName = chatServiceName;
    }

    channel.lang = lang;
    channel.inChannel = inChannel ?? true;
    channel.queueOpen = queueOpen ?? true;
    channel.enabled = enabled ?? true;
    channel.game =
      game ??
      (await this.gameRepository.findOneBy({
        name: 'audio_trip',
      }));
    channel.joinedOn = new Date();

    await this.channelRepository.save(channel);

    for (const chatClient of this.chatManagerService.getChatClients()) {
      if (chatClient.chatServiceName == chatServiceName) {
        this.logger.debug('Instructing chatClient to join channel', {
          channelName: channelName,
          chatServiceName: chatServiceName,
        });
        await chatClient.joinChannel(channelName);
      }
    }

    this.channelsTotal.inc();
    this.channelsJoinedTotal.inc();
    this.channelsJoinedCounterTotal.inc();
    this.channelsBotEnabledTotal.inc();

    return channel;
  }

  async joinChannel(channel: Channel): Promise<void> {
    const chatClient = this.chatManagerService.getChatClientForChatServiceName(
      channel.chatServiceName
    );
    this.logger.debug(`getChatClientForChatServiceName`, {
      chatServiceName: channel.chatServiceName,
      channelName: channel.channelName,
      chatClientReturned: chatClient ? true : false,
    });
    try {
      await chatClient.joinChannel(channel.channelName);
    } catch (e) {
      this.logger.warn(
        `Join channel ${channel.channelName} failed: ${e.message}`
      );
    }

    if (!channel.inChannel) {
      channel.inChannel = true;
      await this.channelRepository.save(channel);
    }

    this.channelsJoinedTotal.inc();
    this.channelsJoinedCounterTotal.inc();

    this.logger.log(`Joined channel ${channel.channelName}`);
  }

  async leaveChannel(channel: Channel): Promise<void> {
    // Leave the channel
    await this.chatManagerService
      .getChatClientForChatServiceName(channel.chatServiceName)
      .leaveChannel(channel.channelName);
    // Mark the channel that we're not to join it again (until asked to do so).
    channel.inChannel = false;
    channel.leftOn = new Date();
    await this.channelRepository.save(channel);

    this.channelLeftCounterTotal.inc();
    this.channelsJoinedTotal.dec();
  }
}
