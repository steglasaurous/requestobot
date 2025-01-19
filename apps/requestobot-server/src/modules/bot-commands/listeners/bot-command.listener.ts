import { ChatMessageReceiveEvent } from '@steglasaurous/chat';
import { OnEvent } from '@nestjs/event-emitter';
import { BotCommandInterface } from '../commands/bot-command.interface';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Channel } from '../../data-store/entities/channel.entity';
import { Repository } from 'typeorm';
import { MessageFormatterService } from '../services/message-formatter.service';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { Metrics } from '../models/metrics.enum';
import { Counter } from 'prom-client';

@Injectable()
export class BotCommandListener {
  private logger: Logger = new Logger(BotCommandListener.name);
  private botChannel: Channel;
  constructor(
    @Inject('BOT_COMMANDS') private botCommands: BotCommandInterface[],
    @InjectRepository(Channel) private channelRepository: Repository<Channel>,
    @Inject('BOT_CHANNEL_NAME') private botChannelName: string,
    private messageFormatterService: MessageFormatterService,
    @InjectMetric(Metrics.BotCommandsExecutedTotal)
    private botCommandsExecutedTotal: Counter
  ) {
    this.botChannel = new Channel();
    this.botChannel.channelName = botChannelName;
    this.botChannel.lang = 'en';
    this.botChannel.inChannel = true;
    this.botChannel.enabled = true;
    this.botChannel.joinedOn = new Date();
    this.botChannel.queueOpen = false;
  }

  @OnEvent(ChatMessageReceiveEvent.name)
  async handle(chatEvent: ChatMessageReceiveEvent) {
    for (const botCommand of this.botCommands) {
      if (botCommand.matchesTrigger(chatEvent.chatMessage)) {
        // Look up channel instance it's for.
        let channel = await this.channelRepository.findOneBy({
          channelName: chatEvent.chatMessage.channelName,
        });
        if (!channel) {
          if (chatEvent.chatMessage.channelName == this.botChannelName) {
            // This is in the bot's own channel, which won't have an entry in the channels database (nor should it, since it's special).
            // We provide a fake channel instance so it can run with events.
            channel = this.botChannel;
          } else {
            this.logger.warn(
              'Got a message from a channel not found in the database',
              {
                originalMessageId: chatEvent.chatMessage.id,
                botCommand: botCommand.constructor.name,
                username: chatEvent.chatMessage.username,
                chatMessage: chatEvent.chatMessage.message,
                channel: channel.channelName,
                userIsBroadcaster: chatEvent.chatMessage.userIsBroadcaster,
                userIsMod: chatEvent.chatMessage.userIsMod,
                userIsSubscriber: chatEvent.chatMessage.userIsSubscriber,
                userIsVip: chatEvent.chatMessage.userIsVip,
              }
            );

            return;
          }
        }
        if (channel.enabled != true && !botCommand.shouldAlwaysTrigger()) {
          // Ignore it since the bot is disabled, and this command hasn't overridden responding even if disabled.
          return;
        }

        // Consider doing handling for enabled here?

        this.logger.debug('Executing command', {
          originalMessageId: chatEvent.chatMessage.id,
          botCommand: botCommand.constructor.name,
          username: chatEvent.chatMessage.username,
          chatMessage: chatEvent.chatMessage.message,
          channel: channel.channelName,
          userIsBroadcaster: chatEvent.chatMessage.userIsBroadcaster,
          userIsMod: chatEvent.chatMessage.userIsMod,
          userIsSubscriber: chatEvent.chatMessage.userIsSubscriber,
          userIsVip: chatEvent.chatMessage.userIsVip,
        });

        const response = await botCommand.execute(
          channel,
          chatEvent.chatMessage
        );

        if (response) {
          await chatEvent.chatMessage.client.sendMessage(
            channel.channelName,
            this.messageFormatterService.formatMessage(response)
          );
          this.logger.debug('Response', {
            originalMessageId: chatEvent.chatMessage.id,
            channel: channel.channelName,
            response: response,
          });
        }
      }
    }
  }
}
