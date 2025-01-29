import { ChatMessage } from '@steglasaurous/chat';
import { InjectRepository } from '@nestjs/typeorm';
import { Channel } from '../../data-store/entities/channel.entity';
import { Repository } from 'typeorm';
import { Game } from '../../data-store/entities/game.entity';
import { I18nService } from 'nestjs-i18n';
import { BaseBotCommand } from './base.bot-command';
import { Injectable } from '@nestjs/common';
import { ChannelManagerService } from '../../channel-manager/services/channel-manager.service';

@Injectable()
export class SetGameBotCommand extends BaseBotCommand {
  constructor(
    @InjectRepository(Channel) private channelRepository: Repository<Channel>,
    @InjectRepository(Game) private gameRepository: Repository<Game>,
    private i18n: I18nService,
    private channelManager: ChannelManagerService
  ) {
    super();
    this.triggers = ['!setgame'];
  }

  async execute(channel: Channel, chatMessage: ChatMessage): Promise<string> {
    // We'll use the display name to match what game to set the channel to.
    // Only mods and broadcasters can use this
    if (!chatMessage.userIsBroadcaster && !chatMessage.userIsMod) {
      return;
    }

    // Try to find the game specified.
    const inputGameName = chatMessage.message
      .toLowerCase()
      .replace('!setgame', '')
      .trim();
    if (!inputGameName) {
      return this.i18n.t('chat.CurrentGame', {
        lang: channel.lang,
        args: { gameName: channel.game.displayName },
      });
    }

    const game = await this.gameRepository.findOneBy({
      setGameName: inputGameName,
    });

    if (!game) {
      return this.i18n.t('chat.UnsupportedGame');
    }
    await this.channelManager.setGame(channel, game);

    return null;
  }

  getDescription(): string {
    return "Set the game the bot should search requests with. This would be the game name similar to how you'd see it on Twitch. Examples: **!setgame audio trip**, **!setgame spin rhythm xd**";
  }
}
