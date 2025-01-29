import { Module } from '@nestjs/common';
import { ChatManagerService } from './services/chat-manager.service';
import { UtilChatOptions } from './util-chat-options.interface';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { AbstractChatClient } from './services/clients/abstract-chat.client';
import { TwitchChatClient } from './services/clients/twitch-chat.client';
import {
  ConfigurableModuleClass,
  MODULE_OPTIONS_TOKEN,
} from './util-chat.module-definition';
import { TestExternalChatClient } from './services/clients/test-external-chat-client.service';
import { MessageFormatterService } from './services/message-formatter.service';

@Module({
  imports: [EventEmitter2],
  providers: [
    ChatManagerService,
    MessageFormatterService,
    {
      provide: 'ChatClients',
      inject: [EventEmitter2, MODULE_OPTIONS_TOKEN],
      useFactory: (eventEmitter: EventEmitter2, options: UtilChatOptions) => {
        const clients: AbstractChatClient[] = [];
        if (options.twitchConfig !== undefined) {
          // Setup twitch client.
          clients.push(
            new TwitchChatClient(
              options.twitchConfig.clientId,
              options.twitchConfig.clientSecret,
              options.twitchConfig.twitchTokenFile,
              options.twitchConfig.twitchChannel,
              eventEmitter
            )
          );
        }
        if (options.testClient !== undefined) {
          // Setup test client.
          clients.push(
            new TestExternalChatClient(options.testClient.url, eventEmitter)
          );
        }
        return clients;
      },
    },
  ],
  exports: [ChatManagerService, MessageFormatterService],
})
export class UtilChatModule extends ConfigurableModuleClass {}
