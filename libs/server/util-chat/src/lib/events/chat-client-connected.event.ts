import { AbstractChatClient } from '../services/clients/abstract-chat.client';

export class ChatClientConnectedEvent {
  constructor(public client: AbstractChatClient) {}
}
