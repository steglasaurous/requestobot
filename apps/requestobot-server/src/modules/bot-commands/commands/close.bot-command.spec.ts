import { Test, TestingModule } from '@nestjs/testing';
import {
  getGenericNestMock,
  getMockChannel,
  getMockChatMessage,
} from '../../../../test/helpers';
import { I18nService } from 'nestjs-i18n';
import { CloseBotCommand } from './close.bot-command';
import { ChannelManagerService } from '../../channel-manager/services/channel-manager.service';

describe('Close queue bot command', () => {
  let service: CloseBotCommand;
  let i18nMock;
  let channel;
  let chatMessage;
  let channelManager;

  const channelRepositoryMock = {
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CloseBotCommand],
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

    service = module.get(CloseBotCommand);
    i18nMock = module.get(I18nService);
    channel = getMockChannel();
    chatMessage = getMockChatMessage();
    channelManager = module.get(ChannelManagerService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should return a description of the command', () => {
    expect(service.getDescription().length).toBeGreaterThan(1);
  });

  it('should close the queue if it is open, and the user is a broadcaster', async () => {
    channel.queueOpen = true;
    channel.lang = 'en';
    chatMessage.userIsBroadcaster = true;

    const response = await service.execute(channel, chatMessage);
    expect(response).toEqual(null);
    expect(channelManager.closeQueue).toHaveBeenCalledWith(channel);
  });

  it('should close the queue if it is open, and the user is a moderator', async () => {
    channel.queueOpen = true;
    channel.lang = 'en';

    chatMessage.userIsBroadcaster = false;
    chatMessage.userIsMod = true;

    const response = await service.execute(channel, chatMessage);
    expect(response).toEqual(null);
    expect(channelManager.closeQueue).toHaveBeenCalledWith(channel);
  });

  it('should respond that the queue is already closed', async () => {
    channel.queueOpen = false;
    channel.lang = 'en';

    chatMessage.userIsBroadcaster = true;

    const response = await service.execute(channel, chatMessage);
    expect(response).toEqual('chat.QueueAlreadyClosed');
    expect(i18nMock.t).toHaveBeenCalledWith('chat.QueueAlreadyClosed', {
      lang: 'en',
    });
    expect(channelRepositoryMock.save).not.toHaveBeenCalled();
  });

  it('should not respond if users is not a broadcaster or moderator', async () => {
    channel.queueOpen = false;
    channel.lang = 'en';

    chatMessage.userIsBroadcaster = false;
    chatMessage.userIsMod = false;

    const response = await service.execute(channel, chatMessage);
    expect(response).toEqual(undefined);
    expect(channelRepositoryMock.save).not.toHaveBeenCalled();
  });
});
