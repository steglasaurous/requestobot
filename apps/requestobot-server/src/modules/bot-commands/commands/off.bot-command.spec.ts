import { Test, TestingModule } from '@nestjs/testing';
import {
  getGenericNestMock,
  getMockChannel,
  getMockChatMessage,
} from '../../../../test/helpers';
import { I18nService } from 'nestjs-i18n';
import { OffBotCommand } from './off.bot-command';
import { ChannelManagerService } from '../../channel-manager/services/channel-manager.service';

describe('Off bot command', () => {
  const channelRepositoryMock = {
    save: jest.fn(),
    findOneBy: jest.fn(),
  };
  let service: OffBotCommand;
  let i18n;
  let channelManager;
  let channel;
  let chatMessage;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OffBotCommand],
    })
      .useMocker((token) => {
        switch (token) {
          case 'ChannelRepository':
            return channelRepositoryMock;
          default:
            return getGenericNestMock(token);
        }
      })
      .compile();

    service = module.get(OffBotCommand);
    i18n = module.get(I18nService);
    channelManager = module.get(ChannelManagerService);
    channel = getMockChannel();
    chatMessage = getMockChatMessage();
    chatMessage.userIsBroadcaster = true;
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should return a description of the command', () => {
    expect(service.getDescription().length).toBeGreaterThan(1);
  });

  it('should disable the bot', async () => {
    const response = await service.execute(channel, chatMessage);

    expect(response).toEqual(null);
    expect(channelManager.disableBot).toHaveBeenCalledWith(channel);
  });

  it('should not respond if the user is not a broadcaster or moderator', async () => {
    chatMessage.userIsBroadcaster = false;
    chatMessage.userIsMod = false;

    const response = await service.execute(channel, chatMessage);
    expect(response).toBeNull();
  });

  it('should respond that the bot is already off', async () => {
    channel.enabled = false;

    const response = await service.execute(channel, chatMessage);
    expect(response).toEqual('chat.AlreadyOff');
    expect(channelRepositoryMock.save).not.toHaveBeenCalled();
  });

  it('should always trigger regardless of whether the bot is enabled', () => {
    expect(service.shouldAlwaysTrigger()).toBeTruthy();
  });
});
