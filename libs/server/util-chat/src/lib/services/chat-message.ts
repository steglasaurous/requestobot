import { AbstractChatClient } from './clients/abstract-chat.client';

export interface BaseChatMessage {
  id: string;
  username: string;
  channelName: string;
  message: string;
  emotes: Map<string, string[]>;
  date: Date;
  color: string;
  userIsMod: boolean;
  userIsBroadcaster: boolean;
  userIsVip: boolean;
  userIsSubscriber: boolean;
}

export interface ChatMessage extends BaseChatMessage {
  client: AbstractChatClient;
}
