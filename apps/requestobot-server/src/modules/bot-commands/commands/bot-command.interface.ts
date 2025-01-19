import { ChatMessage } from '@steglasaurous/chat';
import { Channel } from '../../data-store/entities/channel.entity';

export interface BotCommandInterface {
  /**
   * Return the 'primary' trigger for this command. ex: !req
   */
  getTrigger(): string;

  /**
   * If there are trigger aliases, this returns what those are.
   */
  getTriggerAliases(): string[];

  /**
   * Return a markdown-enabled description of how the command works
   */
  getDescription(): string;

  /**
   * Returns true if a given message matches a trigger.
   */
  matchesTrigger(chatMessage: ChatMessage): boolean;
  // matchesTrigger(channel: Channel, chatMessage: ChatMessage): boolean;

  /**
   * Return true if it should respond regardless if the bot is disabled.  This should be false for most commands.
   */
  shouldAlwaysTrigger(): boolean;

  /**
   * Executes the command as necessary, returning the response it should send back to the chat, if any.
   */
  execute(channel: Channel, chatMessage: ChatMessage): Promise<string>;
}
