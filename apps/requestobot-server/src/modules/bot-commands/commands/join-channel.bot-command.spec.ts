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
import { ChatMessage } from '@steglasaurous/chat';
import { Channel } from '../../data-store/entities/channel.entity';
import { I18nService } from 'nestjs-i18n';
import { MessageFormatterService } from '../services/message-formatter.service';

describe('Join channel bot command', () => {
  const channelRepositoryMock = {
    save: jest.fn(),
    findOneBy: jest.fn(),
  };
  let service: JoinChannelBotCommand;
  let i18n;
  let messageFormatterService;
  let channel;
  let chatMessage;

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
          case getToken(Metrics.ChannelsTotal):
          case getToken(Metrics.ChannelJoinedCounterTotal):
          case getToken(Metrics.ChannelLeftCounterTotal):
          case getToken(Metrics.ChannelsJoinedTotal):
          case getToken(Metrics.ChannelsBotEnabledTotal):
            return {
              inc: jest.fn(),
              dec: jest.fn(),
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
    messageFormatterService = module.get(MessageFormatterService);
    channel = getMockChannel();
    channel.channelName = 'BOT_CHANNEL_NAME';

    chatMessage = getMockChatMessage();
    chatMessage.channelName = 'BOT_CHANNEL_NAME';
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should return a description of the command', () => {
    expect(service.getDescription().length).toBeGreaterThan(1);
  });

  it('should join a new channel', async () => {
    channelRepositoryMock.findOneBy.mockReturnValue(undefined);
    channel.lang = 'en';

    messageFormatterService.formatMessage.mockReturnValueOnce(
      'chat.HelloChannel'
    );

    const response = await service.execute(channel, chatMessage);
    const channelSaveActual = channelRepositoryMock.save.mock.calls[0][0];
    expect(channelSaveActual.channelName).toEqual(chatMessage.username);
    expect(channelSaveActual.inChannel).toBeTruthy();
    expect(channelSaveActual.joinedOn).toBeInstanceOf(Date);
    expect(channelSaveActual.queueOpen).toBeTruthy();
    expect(channelSaveActual.game).toBeInstanceOf(Game);
    expect(chatMessage.client.joinChannel).toHaveBeenCalledWith(
      chatMessage.username
    );
    expect(chatMessage.client.sendMessage).toHaveBeenCalledWith(
      chatMessage.username,
      'chat.HelloChannel'
    );

    expect(response).toEqual('chat.JoinedChannel');
    expect(i18n.t.mock.calls[1][1]).toEqual({
      lang: 'en',
      args: { channelName: chatMessage.username },
    });
  });

  it('should respond with an already joined message if the bot is already in the channel', async () => {
    const userChannel = new Channel();
    userChannel.channelName = 'steglasaurous';
    userChannel.inChannel = true;

    channelRepositoryMock.findOneBy.mockReturnValue(
      Promise.resolve(userChannel)
    );

    const response = await service.execute(channel, chatMessage);
    expect(i18n.t).toHaveBeenCalledWith('chat.AlreadyJoined', { lang: 'en' });
    expect(response).toEqual('chat.AlreadyJoined');
  });

  it("should re-join a channel if it's in the database but not in the channel", async () => {
    const userChannel = new Channel();
    userChannel.inChannel = false;
    userChannel.channelName = 'testuser';

    channelRepositoryMock.findOneBy.mockReturnValue(
      Promise.resolve(userChannel)
    );

    messageFormatterService.formatMessage.mockReturnValueOnce(
      'chat.HelloChannel'
    );

    const response = await service.execute(channel, chatMessage);
    const channelSaveActual = channelRepositoryMock.save.mock.calls[0][0];
    expect(channelSaveActual.channelName).toEqual(chatMessage.username);
    expect(channelSaveActual.inChannel).toBeTruthy();
    expect(channelSaveActual.joinedOn).toBeInstanceOf(Date);
    expect(channelSaveActual.queueOpen).toBeTruthy();
    expect(channelSaveActual.game).toBeInstanceOf(Game);
    expect(chatMessage.client.joinChannel).toHaveBeenCalledWith(
      chatMessage.username
    );
    expect(chatMessage.client.sendMessage).toHaveBeenCalledWith(
      chatMessage.username,
      'chat.HelloChannel'
    );

    expect(response).toEqual('chat.JoinedChannel');
    expect(i18n.t.mock.calls[1][1]).toEqual({
      lang: 'en',
      args: { channelName: chatMessage.username },
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
