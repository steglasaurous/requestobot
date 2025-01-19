import { Subject } from 'rxjs';
import { ChatMessage } from '../chat-message';
import { AbstractChatClient } from './abstract-chat.client';
import { Injectable, Logger } from '@nestjs/common';
import WebSocket from 'ws';
import { ChatClientConnectedEvent } from '../../events/chat-client-connected.event';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ChatServiceName } from '../chat-service-name.enum';

export interface SentChatMessage {
  channelName: string;
  message: string;
}

/**
 * This connects to a websocket server implementation (see requestobot-server-e2e
 * app for details).  The idea is it's a mock chat client that responds to
 * simple websocket messages.
 */
@Injectable()
export class TestExternalChatClient extends AbstractChatClient {
  messages$: Subject<ChatMessage> = new Subject<ChatMessage>();
  private websocket!: WebSocket;
  private joinedChannels: Set<string> = new Set<string>();
  private sentMessages: SentChatMessage[] = [];
  sentMessages$: Subject<SentChatMessage> = new Subject<SentChatMessage>();
  private logger: Logger = new Logger(this.constructor.name);
  public readonly chatServiceName = ChatServiceName.TEST_EXTERNAL;

  constructor(
    private websocketUrl = 'ws://localhost:3030',
    private eventEmitter: EventEmitter2
  ) {
    super();
  }
  connect(): Promise<void> {
    this.logger.log('Connecting to test server...');

    this.websocket = new WebSocket(this.websocketUrl);
    this.websocket.on('open', () => {
      this.logger.log('Connected to test server');
      this.eventEmitter.emitAsync(ChatClientConnectedEvent.name, <
        ChatClientConnectedEvent
      >{ client: this });
      this.logger.log('emitted connected event');
    });

    this.websocket.on('message', (data) => {
      // Expect data to contain { id, channelName, message }
      const jsonMessage: any = JSON.parse(data.toString());
      if (jsonMessage.event !== 'message') {
        this.logger.log(
          'Warning: received unknown message from test server',
          jsonMessage
        );
      }
      const jsonData: any = jsonMessage.data;

      this.messages$.next({
        channelName: jsonData.channelName,
        client: this,
        color: jsonData.color,
        date: new Date(),
        emotes: jsonData.emotes,
        id: jsonData.id,
        message: jsonData.message,
        userIsBroadcaster: jsonData.userIsBroadcaster,
        userIsMod: jsonData.userIsMod,
        userIsSubscriber: jsonData.userIsSubscriber,
        userIsVip: jsonData.userIsVip,
        username: jsonData.username,
      } as ChatMessage);
    });

    return Promise.resolve();
  }
  disconnect(): Promise<void> {
    this.websocket.close();
    this.logger.log('Disconnected from test server');

    return Promise.resolve();
  }

  joinChannel(channelName: string): Promise<void> {
    this.websocket.send(
      JSON.stringify({
        event: 'joinChannel',
        data: { channelName: channelName },
      })
    );
    this.joinedChannels.add(channelName);
    this.logger.log('joinChannel', { channelName: channelName });
    return Promise.resolve();
  }
  leaveChannel(channelName: string): Promise<void> {
    this.websocket.send(
      JSON.stringify({
        event: 'leaveChannel',
        data: { channelName: channelName },
      })
    );
    this.joinedChannels.delete(channelName);
    this.logger.log('leaveChanel', { channelName: channelName });
    return Promise.resolve();
  }

  sendMessage(channelName: string, message: string): Promise<void> {
    this.websocket.send(
      JSON.stringify({
        event: 'message',
        data: {
          channelName: channelName,
          message: message,
        },
      })
    );

    const sentMessage: SentChatMessage = {
      channelName: channelName,
      message: message,
    };

    this.sentMessages.push(sentMessage);
    this.sentMessages$.next(sentMessage);
    this.logger.log('sendMessage', {
      channelName: channelName,
      message: message,
    });

    return Promise.resolve();
  }
}
