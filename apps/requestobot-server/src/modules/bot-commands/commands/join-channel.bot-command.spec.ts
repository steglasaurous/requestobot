import { Test, TestingModule } from '@nestjs/testing';
import { getToken } from '@willsoto/nestjs-prometheus';
import { Metrics } from '../models/metrics.enum';
import {
  getGenericNestMock,
  getMockChannel,
  getMockChatMessage,
} from '../../../../test/helpers';
import { JoinChannelBotCommand } from './join-channel.bot-command';
import { Game } from '../../data-store/entities/game.entity';
import { ChatMessage, MessageFormatterService } from '@steglasaurous/chat';
import { Channel } from '../../data-store/entities/channel.entity';
import { I18nService } from 'nestjs-i18n';
import { ChannelManagerService } from '../../channel-manager/services/channel-manager.service';

describe('Join channel bot command', () => {
  const channelRepositoryMock = {
    save: jest.fn(),
    findOneBy: jest.fn(),
  };
  let service: JoinChannelBotCommand;
  let i18n;
  let channel;
  let chatMessage;
  let channelManager;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JoinChannelBotCommand],
    })
      .useMocker((token) => {
        switch (token) {
          case 'ChannelRepository':
            return channelRepositoryMock;
          case 'GameRepository':
            return {
              findOneBy: jest.fn().mockReturnValue(new Game()),
            };
          case 'BOT_CHANNEL_NAME':
            return token;
          default:
            return getGenericNestMock(token);
        }
      })
      .compile();

    service = module.get(JoinChannelBotCommand);
    i18n = module.get(I18nService);
    channel = getMockChannel();
    channel.channelName = 'BOT_CHANNEL_NAME';

    chatMessage = getMockChatMessage();
    chatMessage.channelName = 'BOT_CHANNEL_NAME';
    channelManager = module.get(ChannelManagerService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should return a description of the command', () => {
    expect(service.getDescription().length).toBeGreaterThan(1);
  });

  it('should join a new channel', async () => {
    channelRepositoryMock.findOneBy.mockReturnValue(undefined);
    channelManager.createChannel.mockReturnValue({
      channelName: channel.channelName,
    });

    channel.lang = 'en';

    const response = await service.execute(channel, chatMessage);
    expect(response).toEqual('chat.JoinedChannel');
    expect(channelManager.createChannel).toHaveBeenCalledWith(
      chatMessage.username,
      chatMessage.client.chatServiceName
    );
    expect(i18n.t).toHaveBeenCalledWith('chat.JoinedChannel', {
      lang: 'en',
      args: { channelName: channel.channelName },
    });
  });

  it('should respond with an already joined message if the bot is already in the channel', async () => {
    const userChannel = new Channel();
    userChannel.channelName = 'steglasaurous';
    userChannel.inChannel = true;

    channelManager.getChannel.mockReturnValue(userChannel);

    const response = await service.execute(channel, chatMessage);
    expect(i18n.t).toHaveBeenCalledWith('chat.AlreadyJoined', { lang: 'en' });
    expect(response).toEqual('chat.AlreadyJoined');
  });

  it("should re-join a channel if it's in the database but not in the channel", async () => {
    const userChannel = new Channel();
    userChannel.inChannel = false;
    userChannel.channelName = 'testuser';

    channelManager.getChannel.mockReturnValue(userChannel);

    const response = await service.execute(channel, chatMessage);
    expect(response).toEqual('chat.JoinedChannel');
    expect(channelManager.joinChannel).toHaveBeenCalledWith(userChannel);
    expect(i18n.t).toHaveBeenCalledWith('chat.JoinedChannel', {
      lang: 'en',
      args: { channelName: userChannel.channelName },
    });
  });

  it("should only trigger if the message is in the bot's own channel", () => {
    const chatMessage = {
      channelName: 'BOT_CHANNEL_NAME',
      message: '!join',
    } as unknown as ChatMessage;
    expect(service.matchesTrigger(chatMessage)).toBeTruthy();
  });

  it('should always be allowed to trigger, regardless if the bot is enabled or not', () => {
    expect(service.shouldAlwaysTrigger()).toBeTruthy();
  });
});
