import { Subject, take } from 'rxjs';
import { ChatMessage } from '../chat-message';
import { AbstractChatClient } from './abstract-chat.client';
import { Injectable } from '@nestjs/common';
import { ChatServiceName } from '../chat-service-name.enum';

export interface SentChatMessage {
  channelName: string;
  message: string;
}

@Injectable()
export class TestInternalChatClient extends AbstractChatClient {
  messages$: Subject<ChatMessage> = new Subject<ChatMessage>();

  private joinedChannels: Set<string> = new Set<string>();
  private sentMessages: SentChatMessage[] = [];
  sentMessages$: Subject<SentChatMessage> = new Subject<SentChatMessage>();

  public readonly chatServiceName = ChatServiceName.TEST_INTERNAL;

  connect(): Promise<void> {
    return Promise.resolve();
  }
  disconnect(): Promise<void> {
    throw new Error('Method not implemented.');
  }
  joinChannel(channelName: string): Promise<void> {
    this.joinedChannels.add(channelName);
    return Promise.resolve();
  }
  leaveChannel(channelName: string): Promise<void> {
    this.joinedChannels.delete(channelName);
    return Promise.resolve();
  }

  sendMessage(channelName: string, message: string): Promise<void> {
    const sentMessage: SentChatMessage = {
      channelName: channelName,
      message: message,
    };

    this.sentMessages.push(sentMessage);
    this.sentMessages$.next(sentMessage);
    return Promise.resolve();
  }

  /**
   * Emits the given chat message to the messages observable to simulate a received message.
   * @param chatMessage
   */
  emitReceivedMessage(chatMessage: ChatMessage): void {
    this.messages$.next(chatMessage);
  }

  /**
   * Emits the given chat message to the messages observable to simulate a received message,
   * and waits for a response.  Once received, the promise resolves with the response message.
   *
   * NOTE: if a response is never received, this promise will never resolve.
   *
   * @param chatMessage
   */
  async emitReceivedMessageAndAwaitResponse(
    chatMessage: ChatMessage
  ): Promise<SentChatMessage> {
    return new Promise<SentChatMessage>((resolve) => {
      this.messages$.next(chatMessage);
      this.sentMessages$.pipe(take(1)).subscribe((sentMessage) => {
        resolve(sentMessage);
      });
    });
  }

  getJoinedChannels(): Set<string> {
    return this.joinedChannels;
  }

  getSentMessages(): { channelName: string; message: string }[] {
    return this.sentMessages;
  }
}
