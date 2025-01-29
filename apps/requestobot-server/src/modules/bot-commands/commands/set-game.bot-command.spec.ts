import { Test, TestingModule } from '@nestjs/testing';
import {
  getGenericNestMock,
  getMockChannel,
  getMockChatMessage,
} from '../../../../test/helpers';
import { I18nService } from 'nestjs-i18n';
import { SetGameBotCommand } from './set-game.bot-command';
import { Game } from '../../data-store/entities/game.entity';
import { ChannelManagerService } from '../../channel-manager/services/channel-manager.service';

describe('Set game bot command', () => {
  const channelRepositoryMock = {
    save: jest.fn(),
    findOneBy: jest.fn(),
  };
  const gameRepositoryMock = {
    findOneBy: jest.fn(),
  };

  let service: SetGameBotCommand;
  let i18n;

  let channel;
  let chatMessage;
  let channelManager;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SetGameBotCommand],
    })
      .useMocker((token) => {
        switch (token) {
          case 'ChannelRepository':
            return channelRepositoryMock;
          case 'GameRepository':
            return gameRepositoryMock;
          default:
            return getGenericNestMock(token);
        }
      })
      .compile();

    service = module.get(SetGameBotCommand);
    i18n = module.get(I18nService);
    channelManager = module.get(ChannelManagerService);

    channel = getMockChannel();
    channel.queueOpen = false;
    channel.game = new Game();
    channel.game.name = 'spin rhythm xd';
    channel.game.displayName = 'Spin Rhythm XD';

    chatMessage = getMockChatMessage();
    chatMessage.userIsBroadcaster = true;
    chatMessage.message = '!setgame audio trip';
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should return a description of the command', () => {
    expect(service.getDescription().length).toBeGreaterThan(1);
  });

  it('should set the game to the one specified', async () => {
    const game = new Game();
    game.name = 'somegame';
    game.displayName = 'Some Game';

    gameRepositoryMock.findOneBy.mockReturnValue(game);

    const response = await service.execute(channel, chatMessage);
    expect(channelManager.setGame).toHaveBeenCalledWith(channel, game);
    expect(response).toEqual(null);
  });

  it('should show the currently set game', async () => {
    chatMessage.message = '!setgame';

    const response = await service.execute(channel, chatMessage);
    expect(response).toEqual('chat.CurrentGame');
    expect(i18n.t).toHaveBeenCalledWith('chat.CurrentGame', {
      lang: 'en',
      args: { gameName: channel.game.displayName },
    });
  });

  it('should indicate the game searched is unsupported or not known', async () => {
    chatMessage.message = '!setgame nogame';
    const response = await service.execute(channel, chatMessage);
    expect(response).toEqual('chat.UnsupportedGame');
  });

  it('should not respond if the user is not a broadcaster or moderator', async () => {
    chatMessage.userIsBroadcaster = false;
    chatMessage.userIsMod = false;

    const response = await service.execute(channel, chatMessage);
    expect(response).toBeUndefined();
    expect(channelRepositoryMock.save).not.toHaveBeenCalled();
  });
});
