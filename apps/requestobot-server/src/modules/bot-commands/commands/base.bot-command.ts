import { BotCommandInterface } from './bot-command.interface';
import { Channel } from '../../data-store/entities/channel.entity';
import { ChatMessage } from '@steglasaurous/chat';

export abstract class BaseBotCommand implements BotCommandInterface {
  protected triggers: string[] = [];

  getTrigger(): string {
    return this.triggers[0];
  }
  getTriggerAliases(): string[] {
    return this.triggers.length > 1 ? this.triggers.slice(1) : [];
  }

  abstract execute(channel: Channel, chatMessage: ChatMessage): Promise<string>;

  abstract getDescription(): string;

  // Generic implementation of 'startsWith' - override if there's more complicated trigger needs.
  matchesTrigger(chatMessage: ChatMessage): boolean {
    let result = false;
    const cleanedChatMessage = chatMessage.message.toLowerCase();

    this.triggers.forEach((trigger) => {
      // We intentionally look for a space after the command so it doesn't accidentially match other commands like
      // !requestobot on
      // We also test for an exact match, which is an opportunity to show some help.
      if (
        cleanedChatMessage.startsWith(trigger + ' ') ||
        cleanedChatMessage == trigger
      ) {
        result = true;
      }
    });

    return result;
  }

  shouldAlwaysTrigger(): boolean {
    return false;
  }
}
