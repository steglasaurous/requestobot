import { Test, TestingModule } from '@nestjs/testing';
import {
  getGenericNestMock,
  getMockChannel,
  getMockChatMessage,
} from '../../../../test/helpers';
import { I18nService } from 'nestjs-i18n';
import { GetOutBotCommand } from './get-out.bot-command';
import { getToken } from '@willsoto/nestjs-prometheus';
import { Metrics } from '../models/metrics.enum';

describe('Get out bot command', () => {
  let service: GetOutBotCommand;
  let i18nMock;
  const channelRepositoryMock = {
    save: jest.fn(),
  };
  let channelLeftCounterTotal;
  let channelsJoinedTotal;
  let channelsBotEnabledTotal;
  let channel;
  let chatMessage;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GetOutBotCommand],
    })
      .useMocker((token) => {
        switch (token) {
          case 'ChannelRepository':
            return channelRepositoryMock;
          case getToken(Metrics.ChannelLeftCounterTotal):
          case getToken(Metrics.ChannelsJoinedTotal):
          case getToken(Metrics.ChannelsBotEnabledTotal):
            return {
              inc: jest.fn(),
              dec: jest.fn(),
            };

          // return token;
          default:
            return getGenericNestMock(token);
        }
      })
      .compile();

    service = module.get(GetOutBotCommand);
    i18nMock = module.get(I18nService);
    channelLeftCounterTotal = module.get(
      getToken(Metrics.ChannelLeftCounterTotal)
    );
    channelsJoinedTotal = module.get(getToken(Metrics.ChannelsJoinedTotal));
    channelsBotEnabledTotal = module.get(
      getToken(Metrics.ChannelsBotEnabledTotal)
    );
    channel = getMockChannel();
    chatMessage = getMockChatMessage();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should return a description of the command', () => {
    expect(service.getDescription().length).toBeGreaterThan(1);
  });

  it('should close the queue if it is open, and the user is a broadcaster', async () => {
    channel.inChannel = true;
    channel.lang = 'en';

    chatMessage.userIsBroadcaster = true;

    const response = await service.execute(channel, chatMessage);

    expect(response).toEqual(undefined);
    expect(i18nMock.t).toHaveBeenCalledWith('chat.ImOut', { lang: 'en' });
    expect(channelRepositoryMock.save).toHaveBeenCalled();
    expect(channelRepositoryMock.save.mock.calls[0][0].inChannel).toEqual(
      false
    );
    expect(channelRepositoryMock.save.mock.calls[0][0].leftOn).toBeInstanceOf(
      Date
    );
    expect(channelLeftCounterTotal.inc).toHaveBeenCalled();
    expect(channelsJoinedTotal.dec).toHaveBeenCalled();

    expect(channelsBotEnabledTotal.dec).toHaveBeenCalled();
  });

  it('should ignore the command if user is not a broadcaster or mod', async () => {
    chatMessage.userIsBroadcaster = false;
    chatMessage.userIsMod = false;

    await service.execute(channel, chatMessage);
    expect(chatMessage.client.sendMessage).not.toHaveBeenCalled();
    expect(chatMessage.client.leaveChannel).not.toHaveBeenCalled();
    expect(channelRepositoryMock.save).not.toHaveBeenCalled();
    expect(channelLeftCounterTotal.inc).not.toHaveBeenCalled();
    expect(channelsJoinedTotal.dec).not.toHaveBeenCalled();
    expect(channelsBotEnabledTotal.dec).not.toHaveBeenCalled();
  });

  it('should always trigger regardless if the bot is enabled or not', () => {
    expect(service.shouldAlwaysTrigger()).toBeTruthy();
  });
});
