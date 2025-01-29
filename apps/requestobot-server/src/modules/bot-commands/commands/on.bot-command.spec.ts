import { Test, TestingModule } from '@nestjs/testing';
import {
  getGenericNestMock,
  getMockChannel,
  getMockChatMessage,
} from '../../../../test/helpers';
import { OffBotCommand } from './off.bot-command';
import { OnBotCommand } from './on.bot-command';
import { ChannelManagerService } from '../../channel-manager/services/channel-manager.service';

describe('On bot command', () => {
  const channelRepositoryMock = {
    save: jest.fn(),
    findOneBy: jest.fn(),
  };
  let service: OffBotCommand;
  let channelManager: ChannelManagerService;
  let channel;
  let chatMessage;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OnBotCommand],
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

    service = module.get(OnBotCommand);
    channelManager = module.get(ChannelManagerService);
    channel = getMockChannel();
    channel.enabled = false;

    chatMessage = getMockChatMessage();
    chatMessage.userIsBroadcaster = true;
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should return a description of the command', () => {
    expect(service.getDescription().length).toBeGreaterThan(1);
  });

  it('should enable the bot', async () => {
    const response = await service.execute(channel, chatMessage);

    expect(response).toEqual(null);
    expect(channelManager.enableBot).toHaveBeenCalledWith(channel);
  });

  it('should not respond if the user is not a broadcaster or moderator', async () => {
    chatMessage.userIsBroadcaster = false;
    chatMessage.userIsMod = false;

    const response = await service.execute(channel, chatMessage);
    expect(response).toBeNull();
    expect(channelManager.enableBot).not.toHaveBeenCalled();
  });

  it('should respond that the bot is already on', async () => {
    channel.enabled = true;

    const response = await service.execute(channel, chatMessage);
    expect(response).toEqual('chat.AlreadyOn');
    expect(channelManager.enableBot).not.toHaveBeenCalled();
  });

  it('should always trigger regardless of whether the bot is enabled', () => {
    expect(service.shouldAlwaysTrigger()).toBeTruthy();
  });
});
