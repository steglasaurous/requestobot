import { Injectable, Logger } from '@nestjs/common';
import {
  ChatManagerService,
  ChatServiceName,
  MessageFormatterService,
} from '@steglasaurous/chat';
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
    private messageFormatterService: MessageFormatterService,
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

    this.logger.log('Created channel', {
      channelName: channelName,
      chatServiceName: chatServiceName,
    });
    return channel;
  }

  async joinChannel(channel: Channel, sendHelloMessage = true): Promise<void> {
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

    if (sendHelloMessage) {
      await this.chatManagerService
        .getChatClientForChatServiceName(channel.chatServiceName)
        .sendMessage(
          channel.channelName,
          this.messageFormatterService.formatMessage(
            this.i18n.t('chat.HelloChannel', {
              lang: channel.lang,
            })
          )
        );
    }

    this.logger.log(`Joined channel ${channel.channelName}`);
  }

  async leaveChannel(channel: Channel): Promise<void> {
    await this.chatManagerService
      .getChatClientForChatServiceName(channel.chatServiceName)
      .sendMessage(
        channel.channelName,
        this.messageFormatterService.formatMessage(
          this.i18n.t('chat.ImOut', { lang: channel.lang })
        )
      );

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

  async enableBot(channel: Channel): Promise<void> {
    channel.enabled = true;
    await this.channelRepository.save(channel);
    this.channelsBotEnabledTotal.inc();

    await this.chatManagerService
      .getChatClientForChatServiceName(channel.chatServiceName)
      .sendMessage(
        channel.channelName,
        this.messageFormatterService.formatMessage(
          this.i18n.t('chat.BotIsOn', { lang: channel.lang })
        )
      );
  }

  async disableBot(channel: Channel): Promise<void> {
    channel.enabled = false;
    await this.channelRepository.save(channel);
    this.channelsBotEnabledTotal.dec();

    await this.chatManagerService
      .getChatClientForChatServiceName(channel.chatServiceName)
      .sendMessage(
        channel.channelName,
        this.messageFormatterService.formatMessage(
          this.i18n.t('chat.BotIsOff', { lang: channel.lang })
        )
      );
  }

  async openQueue(channel: Channel): Promise<void> {
    channel.queueOpen = true;
    await this.channelRepository.save(channel);

    await this.chatManagerService
      .getChatClientForChatServiceName(channel.chatServiceName)
      .sendMessage(
        channel.channelName,
        this.messageFormatterService.formatMessage(
          this.i18n.t('chat.QueueOpen', { lang: channel.lang })
        )
      );
  }

  async closeQueue(channel: Channel): Promise<void> {
    channel.queueOpen = false;
    await this.channelRepository.save(channel);

    await this.chatManagerService
      .getChatClientForChatServiceName(channel.chatServiceName)
      .sendMessage(
        channel.channelName,
        this.messageFormatterService.formatMessage(
          this.i18n.t('chat.QueueClosed', { lang: channel.lang })
        )
      );
  }

  async setGame(channel: Channel, game: Game): Promise<void> {
    channel.game = game;
    await this.channelRepository.save(channel);
    await this.chatManagerService
      .getChatClientForChatServiceName(channel.chatServiceName)
      .sendMessage(
        channel.channelName,
        this.i18n.t('chat.GameChanged', {
          lang: channel.lang,
          args: { gameName: channel.game.displayName },
        })
      );

    // FIXME: Clear queue.
  }
}
